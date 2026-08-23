function calculateRiskScore(merchant) {
    let score = 0;
    const reasons = [];

    // 1. Chargeback Risk
    if (merchant.chargebackRate >= 2) {
        score += 30;
        reasons.push("High chargeback rate");
    } else if (merchant.chargebackRate >= 1) {
        score += 15;
        reasons.push("Elevated chargeback rate");
    }

    // 2. Refund Risk
    if (merchant.refundRate >= 8) {
        score += 20;
        reasons.push("High refund rate");
    } else if (merchant.refundRate >= 5) {
        score += 10;
        reasons.push("Elevated refund rate");
    }

    // 3. RTO Risk
    if (merchant.rtoRate >= 20) {
        score += 25;
        reasons.push("Very high RTO rate");
    } else if (merchant.rtoRate >= 12) {
        score += 15;
        reasons.push("High RTO rate");
    } else if (merchant.rtoRate >= 8) {
        score += 8;
        reasons.push("Elevated RTO rate");
    }

    // 4. Payment Success Risk
    if (merchant.paymentSuccessRate < 85) {
        score += 20;
        reasons.push("Very low payment success rate");
    } else if (merchant.paymentSuccessRate < 92) {
        score += 10;
        reasons.push("Low payment success rate");
    }

    // 5. Cash Flow Risk
    const dailyProfit =
        merchant.averageDailyRevenue - merchant.averageDailyExpenses;

    if (dailyProfit < 0) {
        score += 25;
        reasons.push("Business is operating at a daily loss");
    } else if (dailyProfit < merchant.averageDailyRevenue * 0.1) {
        score += 10;
        reasons.push("Very low daily profit margin");
    }

    // Keep score between 0 and 100
    score = Math.min(score, 100);

    // Determine risk level
    let level;

    if (score >= 70) {
        level = "critical";
    } else if (score >= 40) {
        level = "warning";
    } else {
        level = "healthy";
    }

    return {
        score,
        level,
        reasons
    };
}

module.exports = {
    calculateRiskScore
};