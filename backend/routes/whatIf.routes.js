const express = require("express");
const router = express.Router();

const calculateWhatIf = require("../services/whatIfEngine");
const generateBusinessAdvice = require("../services/llmAdvisor");
const Merchant = require("../models/Merchant");
const Transaction = require("../models/Transaction");

router.post("/:merchantId/what-if", async (req, res) => {
    try {
        const { merchantId } = req.params;

        const merchant = await Merchant.findById(merchantId);

        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: "Merchant not found"
            });
        }

        const transactions = await Transaction.find({
            merchantId
        });

        if (!transactions.length) {
            return res.status(400).json({
                success: false,
                message: "No transactions found for this merchant"
            });
        }

        // -----------------------------------------
        // 1. Current business metrics
        // -----------------------------------------

        const totalRevenue = transactions.reduce(
            (sum, transaction) =>
                sum + (transaction.amount || 0),
            0
        );

        const currentOrders = transactions.length;

        // -----------------------------------------
        // 2. Current profit
        // -----------------------------------------

        const currentProfit = transactions.reduce(
            (sum, transaction) =>
                sum + (transaction.settlementAmount || 0),
            0
        );

        // -----------------------------------------
        // 3. RTO
        // -----------------------------------------

        const rtoCount = transactions.filter(
            (transaction) =>
                transaction.isRTO === true
        ).length;

        // -----------------------------------------
        // 4. Refund
        // -----------------------------------------

        const refundCount = transactions.filter(
            (transaction) =>
                transaction.isRefunded === true
        ).length;

        // -----------------------------------------
        // 5. Payment failures
        // -----------------------------------------

        const failedPaymentCount = transactions.filter(
            (transaction) =>
                transaction.transactionStatus === "failed"
        ).length;

        // -----------------------------------------
        // 6. Chargebacks
        // -----------------------------------------

        const chargebackCount = transactions.filter(
            (transaction) =>
                transaction.isChargeback === true
        ).length;

        // -----------------------------------------
        // 7. Convert to percentages
        // -----------------------------------------

        const currentRTO =
            (rtoCount / currentOrders) * 100;

        const currentRefundRate =
            (refundCount / currentOrders) * 100;

        const currentPaymentFailureRate =
            (failedPaymentCount / currentOrders) * 100;

        const currentChargebackRate =
            (chargebackCount / currentOrders) * 100;

        // -----------------------------------------
        // 8. Calculate What-If scenario
        // -----------------------------------------

        const result = calculateWhatIf({
            currentRevenue: totalRevenue,
            currentProfit,
            currentRTO,
            currentRefundRate,
            currentPaymentFailureRate,
            currentChargebackRate,
            currentOrders,

            ...req.body
        });

        // -----------------------------------------
        // 9. Generate Business Advice
        // -----------------------------------------

        const advice = await generateBusinessAdvice(result);

        // -----------------------------------------
        // 10. Send response
        // -----------------------------------------

        return res.status(200).json({
            success: true,
            message: "What-if scenario analyzed successfully",

            data: {
                merchantId,
                businessName: merchant.businessName,

                scenario: req.body,

                result,

                advice
            }
        });

    } catch (error) {
        console.error(
            "What-if analysis error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to analyze what-if scenario",
            error: error.message
        });
    }
});

module.exports = router;