const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

async function predictMerchantRisk(features) {
    try {
        const response = await axios.post(
            `${ML_SERVICE_URL}/predict`,
            features,
            {
                timeout: 5000
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "ML service error:",
            error.response?.data || error.message
        );

        throw new Error("ML prediction service unavailable");
    }
}

module.exports = {
    predictMerchantRisk
};