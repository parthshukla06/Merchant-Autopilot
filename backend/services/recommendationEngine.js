function generateRecommendations({
    risk,
    financialImpact,
    anomalies
}) {
    const recommendations = [];

    // Critical chargeback problem
    const chargebackAnomaly = anomalies.find(
        (anomaly) => anomaly.type === "CHARGEBACK_SPIKE"
    );

    if (chargebackAnomaly) {
        recommendations.push({
            priority: "critical",
            category: "chargebacks",
            title: "Investigate chargeback spike",
            action:
                "Review recent disputed card transactions and identify common causes such as fraud, delivery disputes, or customer complaints.",
            expectedImpact:
                "Reduce confirmed financial exposure from chargebacks."
        });
    }

    // RTO problem
    const rtoAnomaly = anomalies.find(
        (anomaly) => anomaly.type === "RTO_SPIKE"
    );

    if (rtoAnomaly) {
        recommendations.push({
            priority: "high",
            category: "rto",
            title: "Reduce rising RTO rate",
            action:
                "Analyze COD orders, delivery regions, and repeat RTO customers. Consider additional order verification for high-risk COD orders.",
            expectedImpact:
                "Reduce delivery-related operational losses."
        });
    }

    // Payment failure problem
    const paymentFailureAnomaly = anomalies.find(
        (anomaly) =>
            anomaly.type === "PAYMENT_FAILURE_SPIKE"
    );

    if (paymentFailureAnomaly) {
        recommendations.push({
            priority: "high",
            category: "payments",
            title: "Investigate payment failures",
            action:
                "Check payment gateway logs, UPI/card failure patterns, and retry behaviour. Enable recovery or retry flows for failed payments.",
            expectedImpact:
                "Recover potentially lost revenue from failed payments."
        });
    }

    // Financial exposure
    if (
        financialImpact &&
        financialImpact.totalFinancialExposure > 10000
    ) {
        recommendations.push({
            priority: "high",
            category: "financial",
            title: "Prioritize financial leakage",
            action:
                "Focus first on the largest source of financial exposure before addressing smaller leakage sources.",
            expectedImpact:
                `Address up to ₹${financialImpact.totalFinancialExposure} in identified financial exposure and recovery opportunity.`
        });
    }

    // Risk level
    if (risk && risk.level === "critical") {
        recommendations.push({
            priority: "critical",
            category: "risk",
            title: "Immediate risk review required",
            action:
                "Review the merchant's highest-risk operational and financial indicators immediately.",
            expectedImpact:
                "Prevent further deterioration of merchant health."
        });
    }

    if (recommendations.length === 0) {
        recommendations.push({
            priority: "low",
            category: "general",
            title: "Continue monitoring",
            action:
                "No major anomalies require immediate intervention. Continue monitoring merchant performance.",
            expectedImpact:
                "Maintain stable merchant operations."
        });
    }

    return {
        count: recommendations.length,
        recommendations
    };
}

module.exports = {
    generateRecommendations
};