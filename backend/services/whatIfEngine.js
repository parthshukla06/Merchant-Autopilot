function calculateWhatIf({
    currentRevenue,
    currentProfit,
    currentRTO,
    currentRefundRate,
    currentPaymentFailureRate,
    currentChargebackRate,
    currentOrders,

    discountPercent = 0,
    salesChangePercent = 0,
    rtoChangePercent = 0,
    refundChangePercent = 0,
    paymentFailureChangePercent = 0,
    chargebackChangePercent = 0
}) {

    // -----------------------------------------
    // 1. New orders
    // -----------------------------------------

    const newOrders =
        currentOrders * (1 + salesChangePercent / 100);


    // -----------------------------------------
    // 2. New revenue from sales growth
    // -----------------------------------------

    const newRevenue =
        currentRevenue * (1 + salesChangePercent / 100);


    // -----------------------------------------
    // 3. Discount cost
    // -----------------------------------------

    const discountCost =
        newRevenue * (discountPercent / 100);


    // -----------------------------------------
    // 4. Revenue after discount
    // -----------------------------------------

    const revenueAfterDiscount =
        newRevenue - discountCost;


    // -----------------------------------------
    // 5. New operational rates
    // -----------------------------------------

    const newRTO = Math.max(
        0,
        currentRTO * (1 + rtoChangePercent / 100)
    );

    const newRefundRate = Math.max(
        0,
        currentRefundRate * (1 + refundChangePercent / 100)
    );

    const newPaymentFailureRate = Math.max(
        0,
        currentPaymentFailureRate *
            (1 + paymentFailureChangePercent / 100)
    );

    const newChargebackRate = Math.max(
        0,
        currentChargebackRate *
            (1 + chargebackChangePercent / 100)
    );


    // -----------------------------------------
    // 6. Calculate recovered money
    // -----------------------------------------

    const rtoRecovery =
        Math.max(
            0,
            (currentRTO - newRTO) / 100
        ) * currentRevenue;

    const refundRecovery =
        Math.max(
            0,
            (currentRefundRate - newRefundRate) / 100
        ) * currentRevenue;

    const paymentRecovery =
        Math.max(
            0,
            (currentPaymentFailureRate -
                newPaymentFailureRate) / 100
        ) * currentRevenue;

    const chargebackRecovery =
        Math.max(
            0,
            (currentChargebackRate -
                newChargebackRate) / 100
        ) * currentRevenue;


    const totalRecovery =
        rtoRecovery +
        refundRecovery +
        paymentRecovery +
        chargebackRecovery;


    // -----------------------------------------
    // 7. New profit
    // -----------------------------------------

    const newProfit =
        currentProfit -
        discountCost +
        totalRecovery;


    // -----------------------------------------
    // 8. Profit change
    // -----------------------------------------

    const profitChange =
        newProfit - currentProfit;


    // -----------------------------------------
    // 9. Recommendation
    // -----------------------------------------

    let recommendation;

    if (profitChange > 0) {
        recommendation = "RECOMMENDED";
    } else if (profitChange === 0) {
        recommendation = "NEUTRAL";
    } else {
        recommendation = "NOT RECOMMENDED";
    }


    // -----------------------------------------
    // 10. Final result
    // -----------------------------------------

    return {

        current: {
            revenue: Number(currentRevenue.toFixed(2)),
            profit: Number(currentProfit.toFixed(2)),
            orders: Math.round(currentOrders),

            rtoRate:
                Number(currentRTO.toFixed(2)),

            refundRate:
                Number(currentRefundRate.toFixed(2)),

            paymentFailureRate:
                Number(currentPaymentFailureRate.toFixed(2)),

            chargebackRate:
                Number(currentChargebackRate.toFixed(2))
        },


        scenario: {
            revenue:
                Number(revenueAfterDiscount.toFixed(2)),

            profit:
                Number(newProfit.toFixed(2)),

            orders:
                Math.round(newOrders),

            rtoRate:
                Number(newRTO.toFixed(2)),

            refundRate:
                Number(newRefundRate.toFixed(2)),

            paymentFailureRate:
                Number(newPaymentFailureRate.toFixed(2)),

            chargebackRate:
                Number(newChargebackRate.toFixed(2))
        },


        impact: {

            revenueChange:
                Number(
                    (
                        revenueAfterDiscount -
                        currentRevenue
                    ).toFixed(2)
                ),

            profitChange:
                Number(
                    profitChange.toFixed(2)
                ),

            additionalOrders:
                Math.round(
                    newOrders - currentOrders
                ),

            discountCost:
                Number(
                    discountCost.toFixed(2)
                ),

            estimatedRecovery:
                Number(
                    totalRecovery.toFixed(2)
                ),

            rtoRecovery:
                Number(
                    rtoRecovery.toFixed(2)
                ),

            refundRecovery:
                Number(
                    refundRecovery.toFixed(2)
                ),

            paymentRecovery:
                Number(
                    paymentRecovery.toFixed(2)
                ),

            chargebackRecovery:
                Number(
                    chargebackRecovery.toFixed(2)
                ),

            recommendation
        }
    };
}

module.exports = calculateWhatIf;