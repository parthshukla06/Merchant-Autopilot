const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Transaction = require("../models/Transaction");
const { calculateRiskScore } = require("../services/riskEngine");

require("dotenv").config({
    path: path.join(__dirname, "../.env"),
});

function calculateFeatures(transactions) {
    const volume = transactions.length;

    if (volume === 0) {
        return null;
    }

    const failed = transactions.filter(
        (t) => t.transactionStatus === "failed"
    ).length;

    const refunded = transactions.filter(
        (t) => t.isRefunded === true
    ).length;

    const rto = transactions.filter(
        (t) => t.isRTO === true
    ).length;

    const chargebacks = transactions.filter(
        (t) => t.isChargeback === true
    ).length;

    const cod = transactions.filter(
        (t) => t.isCOD === true
    ).length;

    const totalAmount = transactions.reduce(
        (sum, t) => sum + Number(t.amount || 0),
        0
    );

    const paymentFailureRate =
        (failed / volume) * 100;

    const refundRate =
        (refunded / volume) * 100;

    const rtoRate =
        (rto / volume) * 100;

    const chargebackRate =
        (chargebacks / volume) * 100;

    const codPercentage =
        (cod / volume) * 100;

    const averageTransactionValue =
        totalAmount / volume;

    const paymentSuccessRate =
        100 - paymentFailureRate;

    const risk = calculateRiskScore({
        chargebackRate,
        refundRate,
        rtoRate,
        paymentSuccessRate,
        averageDailyRevenue: 1,
        averageDailyExpenses: 0,
    });

    return {
        transaction_volume: volume,

        payment_failure_rate:
            Number(paymentFailureRate.toFixed(2)),

        rto_rate:
            Number(rtoRate.toFixed(2)),

        refund_rate:
            Number(refundRate.toFixed(2)),

        chargeback_rate:
            Number(chargebackRate.toFixed(2)),

        cod_percentage:
            Number(codPercentage.toFixed(2)),

        average_transaction_value:
            Number(averageTransactionValue.toFixed(2)),

        risk_score: risk.score,

        risk_level: risk.level,
    };
}

async function generateDataset() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const transactions = await Transaction.find({})
            .sort({ transactionDate: 1 })
            .lean();

        if (!transactions.length) {
            console.log("No transactions found.");
            return;
        }

        console.log(
            `Found ${transactions.length} transactions`
        );

        const dataset = [];

        /*
        --------------------------------------------------
        CREATE MULTIPLE TIME WINDOWS
        --------------------------------------------------

        Instead of:

        210 transactions -> 1 sample

        we create rolling windows:

        transaction 1-30
        transaction 2-31
        transaction 3-32
        ...

        This gives the ML model multiple observations.
        */

        const WINDOW_SIZE = 30;

        if (transactions.length < WINDOW_SIZE) {
            console.log(
                `Need at least ${WINDOW_SIZE} transactions.`
            );
            return;
        }

        for (
            let i = 0;
            i <= transactions.length - WINDOW_SIZE;
            i++
        ) {
            const window = transactions.slice(
                i,
                i + WINDOW_SIZE
            );

            const features = calculateFeatures(window);

            if (features) {
                dataset.push(features);
            }
        }

        /*
        --------------------------------------------------
        REMOVE DUPLICATE SAMPLES
        --------------------------------------------------
        */

        const uniqueDataset = [];

        const seen = new Set();

        for (const row of dataset) {
            const key = JSON.stringify(row);

            if (!seen.has(key)) {
                seen.add(key);
                uniqueDataset.push(row);
            }
        }

        /*
        --------------------------------------------------
        SAVE JSON DATASET
        --------------------------------------------------
        */

        const outputPath = path.join(
            __dirname,
            "merchant-risk-dataset.json"
        );

        fs.writeFileSync(
            outputPath,
            JSON.stringify(uniqueDataset, null, 2)
        );

        /*
        --------------------------------------------------
        SAVE CSV DATASET
        --------------------------------------------------
        */

        const csvPath = path.join(
            __dirname,
            "merchant-risk-dataset.csv"
        );

        const columns = [
            "transaction_volume",
            "payment_failure_rate",
            "rto_rate",
            "refund_rate",
            "chargeback_rate",
            "cod_percentage",
            "average_transaction_value",
            "risk_score",
            "risk_level",
        ];

        const csvRows = [
            columns.join(","),
        ];

        for (const row of uniqueDataset) {
            csvRows.push(
                columns
                    .map((column) => row[column])
                    .join(",")
            );
        }

        fs.writeFileSync(
            csvPath,
            csvRows.join("\n")
        );

        /*
        --------------------------------------------------
        SUMMARY
        --------------------------------------------------
        */

        console.log("");
        console.log(
            "========================================"
        );

        console.log(
            `Dataset samples: ${uniqueDataset.length}`
        );

        console.log(
            `JSON saved: ${outputPath}`
        );

        console.log(
            `CSV saved: ${csvPath}`
        );

        console.log(
            "========================================"
        );

        /*
        --------------------------------------------------
        SHOW FIRST 5 SAMPLES
        --------------------------------------------------
        */

        console.log("");

        console.log(
            JSON.stringify(
                uniqueDataset.slice(0, 5),
                null,
                2
            )
        );

    } catch (error) {
        console.error(
            "Dataset generation error:",
            error.message
        );
    } finally {
        await mongoose.disconnect();
    }
}

generateDataset();