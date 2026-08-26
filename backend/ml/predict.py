import sys
import json
import os
import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "risk_model.pkl"
)


def main():
    try:
        input_data = json.loads(sys.stdin.read())

        model_data = joblib.load(MODEL_PATH)

        model = model_data["model"]
        features = model_data["features"]

        feature_row = {
            feature: input_data[feature]
            for feature in features
        }

        X = pd.DataFrame(
            [feature_row],
            columns=features
        )

        prediction = model.predict(X)[0]

        probabilities = model.predict_proba(X)[0]

        classes = model.classes_

        probability_map = {
            str(classes[i]): float(probabilities[i])
            for i in range(len(classes))
        }

        result = {
            "risk": str(prediction),
            "riskProbability": float(max(probabilities)),
            "probabilities": probability_map
        }

        print(json.dumps(result))

    except Exception as error:
        print(
            json.dumps({
                "error": str(error)
            })
        )

        sys.exit(1)


if __name__ == "__main__":
    main()