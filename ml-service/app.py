from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd


app = Flask(__name__)

CORS(app)


# Load trained model
model = joblib.load("merchant_risk_model.joblib")


FEATURES = [
    "transaction_volume",
    "payment_failure_rate",
    "rto_rate",
    "chargeback_rate",
    "refund_rate",
    "cod_percentage",
    "average_transaction_value"
]


@app.get("/health")
def health():
    return jsonify({
        "success": True,
        "message": "Merchant Autopilot ML service is running"
    })


@app.post("/predict")
def predict():

    try:

        data = request.get_json()

        # Validate required fields
        missing_fields = [
            feature
            for feature in FEATURES
            if feature not in data
        ]

        if missing_fields:
            return jsonify({
                "success": False,
                "message": "Missing required fields",
                "missingFields": missing_fields
            }), 400


        # Convert input into DataFrame
        input_data = pd.DataFrame(
            [[data[feature] for feature in FEATURES]],
            columns=FEATURES
        )


        # Prediction
        prediction = model.predict(input_data)[0]

        probabilities = model.predict_proba(input_data)[0]

        risk_probability = float(
            max(probabilities)
        )


        # Convert prediction number to label
        risk_levels = {
            0: "healthy",
            1: "high",
            2: "critical"
        }

        predicted_risk = risk_levels.get(
            int(prediction),
            "unknown"
        )


        return jsonify({

            "success": True,

            "prediction": {

                "risk": predicted_risk,

                "riskProbability": round(
                    risk_probability,
                    4
                ),

                "classProbabilities": {
                    "healthy": round(
                        float(probabilities[0]),
                        4
                    ),
                    "high": round(
                        float(probabilities[1]),
                        4
                    ),
                    "critical": round(
                        float(probabilities[2]),
                        4
                    )
                }

            }

        })


    except Exception as error:

        print(
            "Prediction error:",
            str(error)
        )

        return jsonify({
            "success": False,
            "message": "Prediction failed",
            "error": str(error)
        }), 500


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )