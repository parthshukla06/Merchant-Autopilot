import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib


# --------------------------------------------------
# 1. Generate training data
# --------------------------------------------------

np.random.seed(42)

data = []

for _ in range(1000):

    transaction_volume = np.random.randint(50, 500)

    payment_failure_rate = np.random.uniform(0, 20)

    rto_rate = np.random.uniform(0, 30)

    chargeback_rate = np.random.uniform(0, 15)

    refund_rate = np.random.uniform(0, 15)

    cod_percentage = np.random.uniform(0, 80)

    average_transaction_value = np.random.uniform(300, 10000)

    # Risk calculation used ONLY to create synthetic labels
    risk_score = (
        payment_failure_rate * 0.25
        + rto_rate * 0.25
        + chargeback_rate * 0.30
        + refund_rate * 0.10
        + cod_percentage * 0.05
        + (transaction_volume < 100) * 5
    )

    if risk_score >= 15:
        risk = 2       # critical

    elif risk_score >= 8:
        risk = 1       # high

    else:
        risk = 0       # healthy

    data.append([
        transaction_volume,
        payment_failure_rate,
        rto_rate,
        chargeback_rate,
        refund_rate,
        cod_percentage,
        average_transaction_value,
        risk
    ])


columns = [
    "transaction_volume",
    "payment_failure_rate",
    "rto_rate",
    "chargeback_rate",
    "refund_rate",
    "cod_percentage",
    "average_transaction_value",
    "risk"
]

df = pd.DataFrame(data, columns=columns)


# --------------------------------------------------
# 2. Split features and target
# --------------------------------------------------

X = df.drop("risk", axis=1)

y = df["risk"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# --------------------------------------------------
# 3. Train Random Forest
# --------------------------------------------------

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)

model.fit(X_train, y_train)


# --------------------------------------------------
# 4. Evaluate model
# --------------------------------------------------

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

print(
    f"Model accuracy: {accuracy * 100:.2f}%"
)


# --------------------------------------------------
# 5. Save trained model
# --------------------------------------------------

joblib.dump(
    model,
    "merchant_risk_model.joblib"
)

print(
    "Model saved as merchant_risk_model.joblib"
)