function generateAIExplanation({
    businessName,
    intelligence
}) {
    const {
        overallPriority,
        executiveSummary,
        keyInsight,
        criticalIssues,
        highPriorityIssues,
        financialOverview,
        topRecommendations
    } = intelligence;

    const criticalText =
        criticalIssues.length > 0
            ? criticalIssues
                .map(
                    (issue) =>
                        `${issue.message} (${issue.change}% change)`
                )
                .join(". ")
            : "No critical anomalies detected.";

    const highPriorityText =
        highPriorityIssues.length > 0
            ? highPriorityIssues
                .map(
                    (issue) =>
                        `${issue.message} (${issue.change}% change)`
                )
                .join(". ")
            : "No high-priority anomalies detected.";

    const recommendationsText =
        topRecommendations.length > 0
            ? topRecommendations
                .map(
                    (recommendation, index) =>
                        `${index + 1}. ${recommendation.title} — ${recommendation.action}`
                )
                .join("\n")
            : "Continue monitoring merchant performance.";

    const explanation = `
Merchant: ${businessName}

Overall Priority: ${overallPriority.toUpperCase()}

Executive Summary:
${executiveSummary}

Key Financial Insight:
${keyInsight}

Confirmed Money At Risk:
₹${financialOverview.confirmedMoneyAtRisk}

Recoverable Opportunity:
₹${financialOverview.recoverableOpportunity}

Total Financial Exposure:
₹${financialOverview.totalFinancialExposure}

Critical Issues:
${criticalText}

High Priority Issues:
${highPriorityText}

Recommended Actions:
${recommendationsText}
`.trim();

    return {
        explanation,
        metadata: {
            generatedBy: "Merchant Autopilot Intelligence Engine",
            priority: overallPriority,
            totalFinancialExposure:
                financialOverview.totalFinancialExposure
        }
    };
}

module.exports = {
    generateAIExplanation
};