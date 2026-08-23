function calculateFinancialImpact(merchant, transactions) {
    let refundLoss = 0;
    let chargebackLoss = 0;
    let rtoOperationalLoss = 0;
    let failedPaymentOpportunity = 0;

    // Assumed operational cost percentages
    // These are configurable assumptions for our MVP.
    const RTO_OPERATIONAL_COST_RATE = 0.15;
    const REFUND_OPERATIONAL_COST_RATE = 0.05;

    for (const transaction of transactions) {
        const amount = transaction.amount || 0;

        // Refund:
        // Merchant loses the operational/revenue contribution associated
        // with processing the refund.
        if (transaction.isRefunded === true) {
            refundLoss += amount * REFUND_OPERATIONAL_COST_RATE;
        }

        // Chargeback:
        // Chargeback is treated as full transaction exposure.
        if (transaction.isChargeback === true) {
            chargebackLoss += amount;
        }

        // RTO:
        // We estimate operational leakage rather than treating the
        // entire order value as a loss.
        if (transaction.isRTO === true) {
            rtoOperationalLoss += amount * RTO_OPERATIONAL_COST_RATE;
        }

        // Failed payment:
        // This is opportunity value, not confirmed loss.
        if (transaction.transactionStatus === "failed") {
            failedPaymentOpportunity += amount;
        }
    }

    const confirmedMoneyAtRisk =
        refundLoss +
        chargebackLoss +
        rtoOperationalLoss;

    const totalFinancialExposure =
        confirmedMoneyAtRisk +
        failedPaymentOpportunity;

    const dailyProfit =
        merchant.averageDailyRevenue -
        merchant.averageDailyExpenses;

    const monthlyProfitEstimate = dailyProfit * 30;

    return {
        refundLoss: Number(refundLoss.toFixed(2)),
        chargebackLoss: Number(chargebackLoss.toFixed(2)),
        rtoOperationalLoss: Number(rtoOperationalLoss.toFixed(2)),
        failedPaymentOpportunity: Number(
            failedPaymentOpportunity.toFixed(2)
        ),

        confirmedMoneyAtRisk: Number(
            confirmedMoneyAtRisk.toFixed(2)
        ),

        totalFinancialExposure: Number(
            totalFinancialExposure.toFixed(2)
        ),

        dailyProfit: Number(dailyProfit.toFixed(2)),
        monthlyProfitEstimate: Number(
            monthlyProfitEstimate.toFixed(2)
        )
    };
}

module.exports = {
    calculateFinancialImpact
};