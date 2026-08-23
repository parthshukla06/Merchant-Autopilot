function buildMerchantIntelligence({
    risk,
    financialImpact,
    anomalies,
    recommendations
}) {
    const criticalAnomalies = anomalies.filter(
        (anomaly) => anomaly.severity === "critical"
    );

    const highAnomalies = anomalies.filter(
        (anomaly) => anomaly.severity === "high"
    );

    let overallPriority = "low";

    if (criticalAnomalies.length > 0) {
        overallPriority = "critical";
    } else if (highAnomalies.length > 0) {
        overallPriority = "high";
    } else if (risk.level === "warning") {
        overallPriority = "medium";
    }

    // Find the largest confirmed financial loss
    const financialSources = [
        {
            category: "chargebacks",
            amount: financialImpact.chargebackLoss
        },
        {
            category: "refunds",
            amount: financialImpact.refundLoss
        },
        {
            category: "rto",
            amount: financialImpact.rtoOperationalLoss
        }
    ];

    financialSources.sort((a, b) => b.amount - a.amount);

    const largestLossSource = financialSources[0];

    const executiveSummary =
        overallPriority === "critical"
            ? `Merchant requires immediate attention. ${criticalAnomalies.length} critical anomaly detected with total financial exposure of ₹${financialImpact.totalFinancialExposure}.`
            : overallPriority === "high"
                ? `Merchant performance requires attention. Multiple high-severity anomalies were detected with total financial exposure of ₹${financialImpact.totalFinancialExposure}.`
                : `Merchant is currently operating within acceptable conditions.`;

    const keyInsight =
        largestLossSource.amount > 0
            ? `${largestLossSource.category} represent the largest confirmed financial loss at ₹${largestLossSource.amount}.`
            : "No significant confirmed financial loss was detected.";

    return {
        overallPriority,

        executiveSummary,

        keyInsight,

        criticalIssues: criticalAnomalies.map(
            (anomaly) => ({
                type: anomaly.type,
                message: anomaly.message,
                change: anomaly.change
            })
        ),

        highPriorityIssues: highAnomalies.map(
            (anomaly) => ({
                type: anomaly.type,
                message: anomaly.message,
                change: anomaly.change
            })
        ),

        financialOverview: {
            confirmedMoneyAtRisk:
                financialImpact.confirmedMoneyAtRisk,

            recoverableOpportunity:
                financialImpact.failedPaymentOpportunity,

            totalFinancialExposure:
                financialImpact.totalFinancialExposure
        },

        topRecommendations:
            recommendations
                .slice(0, 3)
                .map((recommendation) => ({
                    priority: recommendation.priority,
                    title: recommendation.title,
                    action: recommendation.action
                }))
    };
}

module.exports = {
    buildMerchantIntelligence
};