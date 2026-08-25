function calculateRiskScore(merchant) {
    let score = 0;
    const reasons = [];

    // -----------------------------------------
    // Chargeback Risk
    // -----------------------------------------
    if (merchant.chargebackRate >= 5) {
        score += 40;
        reasons.push("Very high chargeback rate");
    } else if (merchant.chargebackRate >= 2) {
        score += 20 + (merchant.chargebackRate - 2) * 6;
        reasons.push("High chargeback rate");
    } else if (merchant.chargebackRate >= 1) {
        score += 10 + (merchant.chargebackRate - 1) * 10;
        reasons.push("Elevated chargeback rate");
    }

    // -----------------------------------------
    // Refund Risk
    // -----------------------------------------
    if (merchant.refundRate >= 15) {
        score += 25;
        reasons.push("Very high refund rate");
    } else if (merchant.refundRate >= 8) {
        score += 12 + (merchant.refundRate - 8) * 1.8;
        reasons.push("High refund rate");
    } else if (merchant.refundRate >= 5) {
        score += 6 + (merchant.refundRate - 5) * 2;
        reasons.push("Elevated refund rate");
    }

    // -----------------------------------------
    // RTO Risk
    // -----------------------------------------
    if (merchant.rtoRate >= 25) {
        score += 25;
        reasons.push("Very high RTO rate");
    } else if (merchant.rtoRate >= 12) {
        score += 12 + (merchant.rtoRate - 12) * 1;
        reasons.push("High RTO rate");
    } else if (merchant.rtoRate >= 8) {
        score += 6 + (merchant.rtoRate - 8) * 1.5;
        reasons.push("Elevated RTO rate");
    }

    // -----------------------------------------
    // Payment Failure Risk
    // -----------------------------------------
    const paymentFailureRate =
        100 - merchant.paymentSuccessRate;

    if (paymentFailureRate >= 15) {
        score += 20;
        reasons.push("Very high payment failure rate");
    } else if (paymentFailureRate >= 8) {
        score += 10 + (paymentFailureRate - 8) * 1.4;
        reasons.push("High payment failure rate");
    } else if (paymentFailureRate >= 5) {
        score += 5 + (paymentFailureRate - 5) * 1.5;
        reasons.push("Elevated payment failure rate");
    }

    // -----------------------------------------
    // Cash Flow Risk
    // -----------------------------------------
    const dailyProfit =
        merchant.averageDailyRevenue -
        merchant.averageDailyExpenses;

    if (dailyProfit < 0) {
        score += 25;
        reasons.push("Business is operating at a daily loss");
    } else if (
        merchant.averageDailyRevenue > 0 &&
        dailyProfit <
            merchant.averageDailyRevenue * 0.1
    ) {
        score += 10;
        reasons.push("Very low daily profit margin");
    }

    // -----------------------------------------
    // Final score
    // -----------------------------------------
    score = Math.round(Math.min(Math.max(score, 0), 100));

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
        reasons,
    };
}

module.exports = {
    calculateRiskScore,
};