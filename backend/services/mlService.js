const { calculateRiskScore } = require("./riskEngine");

async function predictMerchantRisk(features) {
    const merchant = {
        chargebackRate: features.chargeback_rate || 0,

        refundRate: features.refund_rate || 0,

        rtoRate: features.rto_rate || 0,

        paymentSuccessRate:
            100 - (features.payment_failure_rate || 0),

        averageDailyRevenue:
            (features.average_transaction_value || 0) *
            (features.transaction_volume || 0),

        averageDailyExpenses: 0,
    };

    const result = calculateRiskScore(merchant);

    return {
        prediction: result.level,
        score: result.score,
        reasons: result.reasons,
    };
}

module.exports = {
    predictMerchantRisk,
};