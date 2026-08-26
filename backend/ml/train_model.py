import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "merchant-risk-dataset.csv"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "risk_model.pkl"
)


# --------------------------------------------------
# LOAD DATASET
# --------------------------------------------------

print("Loading dataset...")

df = pd.read_csv(DATASET_PATH)

print(f"Dataset shape: {df.shape}")

print("\nRisk distribution:")
print(df["risk_level"].value_counts())


# --------------------------------------------------
# FEATURES
# --------------------------------------------------

FEATURES = [
    "transaction_volume",
    "payment_failure_rate",
    "rto_rate",
    "refund_rate",
    "chargeback_rate",
    "cod_percentage",
    "average_transaction_value",
]

TARGET = "risk_level"


X = df[FEATURES]
y = df[TARGET]


# --------------------------------------------------
# TRAIN / TEST SPLIT
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# --------------------------------------------------
# MODEL
# --------------------------------------------------

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    min_samples_split=4,
    min_samples_leaf=2,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)


print("\nTraining Random Forest...")

model.fit(X_train, y_train)


# --------------------------------------------------
# EVALUATION
# --------------------------------------------------

y_pred = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    y_pred
)


print("\n========================================")
print("MODEL EVALUATION")
print("========================================")

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred,
        zero_division=0
    )
)


print("Confusion Matrix:")

print(
    confusion_matrix(
        y_test,
        y_pred
    )
)


# --------------------------------------------------
# FEATURE IMPORTANCE
# --------------------------------------------------

print("\nFeature Importance:")

importance = pd.DataFrame({
    "feature": FEATURES,
    "importance": model.feature_importances_
})

importance = importance.sort_values(
    by="importance",
    ascending=False
)

print(importance.to_string(index=False))


# --------------------------------------------------
# SAVE MODEL
# --------------------------------------------------

joblib.dump(
    {
        "model": model,
        "features": FEATURES,
    },
    MODEL_PATH
)


print("\n========================================")
print("MODEL SAVED")
print("========================================")

print(MODEL_PATH)