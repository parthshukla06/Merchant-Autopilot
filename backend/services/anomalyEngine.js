function calculateAnomalies(transactions) {
    if (!transactions || transactions.length === 0) {
        return {
            anomalies: [],
            message: "Not enough transaction data"
        };
    }

    const now = new Date();

    const recentPeriod = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        const daysAgo =
            (now - transactionDate) / (1000 * 60 * 60 * 24);

        return daysAgo <= 7;
    });

    const previousPeriod = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        const daysAgo =
            (now - transactionDate) / (1000 * 60 * 60 * 24);

        return daysAgo > 7 && daysAgo <= 14;
    });

    if (previousPeriod.length === 0) {
        return {
            anomalies: [],
            message: "Not enough historical data for comparison"
        };
    }

    const calculateRTO = (data) => {
        if (data.length === 0) return 0;

        const rtoCount = data.filter(
            (transaction) => transaction.isRTO === true
        ).length;

        return (rtoCount / data.length) * 100;
    };

    const calculateFailureRate = (data) => {
        if (data.length === 0) return 0;

        const failedCount = data.filter(
            (transaction) =>
                transaction.transactionStatus === "failed"
        ).length;

        return (failedCount / data.length) * 100;
    };

    const calculateChargebackRate = (data) => {
        if (data.length === 0) return 0;

        const chargebackCount = data.filter(
            (transaction) => transaction.isChargeback === true
        ).length;

        return (chargebackCount / data.length) * 100;
    };

    const recentRTO = calculateRTO(recentPeriod);
    const previousRTO = calculateRTO(previousPeriod);

    const recentFailureRate =
        calculateFailureRate(recentPeriod);

    const previousFailureRate =
        calculateFailureRate(previousPeriod);

    const recentChargebackRate =
        calculateChargebackRate(recentPeriod);

    const previousChargebackRate =
        calculateChargebackRate(previousPeriod);

    const anomalies = [];

    // RTO anomaly
    if (
        recentRTO > previousRTO &&
        recentRTO - previousRTO >= 5
    ) {
        anomalies.push({
            type: "RTO_SPIKE",
            severity: "high",
            previousValue: Number(previousRTO.toFixed(2)),
            currentValue: Number(recentRTO.toFixed(2)),
            change: Number(
                (recentRTO - previousRTO).toFixed(2)
            ),
            message: "RTO rate increased significantly"
        });
    }

    // Payment failure anomaly
    if (
        recentFailureRate > previousFailureRate &&
        recentFailureRate - previousFailureRate >= 5
    ) {
        anomalies.push({
            type: "PAYMENT_FAILURE_SPIKE",
            severity: "high",
            previousValue: Number(
                previousFailureRate.toFixed(2)
            ),
            currentValue: Number(
                recentFailureRate.toFixed(2)
            ),
            change: Number(
                (recentFailureRate - previousFailureRate).toFixed(2)
            ),
            message: "Payment failure rate increased significantly"
        });
    }

    // Chargeback anomaly
    if (
        recentChargebackRate > previousChargebackRate &&
        recentChargebackRate - previousChargebackRate >= 3
    ) {
        anomalies.push({
            type: "CHARGEBACK_SPIKE",
            severity: "critical",
            previousValue: Number(
                previousChargebackRate.toFixed(2)
            ),
            currentValue: Number(
                recentChargebackRate.toFixed(2)
            ),
            change: Number(
                (recentChargebackRate - previousChargebackRate).toFixed(2)
            ),
            message: "Chargeback rate increased significantly"
        });
    }

    return {
        anomalies,
        summary: {
            recentTransactions: recentPeriod.length,
            previousTransactions: previousPeriod.length,
            recentRTO: Number(recentRTO.toFixed(2)),
            previousRTO: Number(previousRTO.toFixed(2)),
            recentFailureRate: Number(
                recentFailureRate.toFixed(2)
            ),
            previousFailureRate: Number(
                previousFailureRate.toFixed(2)
            ),
            recentChargebackRate: Number(
                recentChargebackRate.toFixed(2)
            ),
            previousChargebackRate: Number(
                previousChargebackRate.toFixed(2)
            )
        }
    };
}

module.exports = {
    calculateAnomalies
};