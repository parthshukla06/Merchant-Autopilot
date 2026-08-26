const express = require("express");
const router = express.Router();

const calculateWhatIf = require("../services/whatIfEngine");
const { calculateRiskScore } = require("../services/riskEngine");
const generateBusinessAdvice = require("../services/llmAdvisor");
const Merchant = require("../models/Merchant");
const Transaction = require("../models/Transaction");

router.post("/:merchantId/what-if", async (req, res) => {
  try {
    const { merchantId } = req.params;

    const {
      discountPercent = 0,
      salesChangePercent = 0,
      rtoChangePercent = 0,
      refundChangePercent = 0,
      paymentFailureChangePercent = 0,
      chargebackChangePercent = 0,
    } = req.body;

    const scenarioValues = {
      discountPercent,
      salesChangePercent,
      rtoChangePercent,
      refundChangePercent,
      paymentFailureChangePercent,
      chargebackChangePercent,
    };

    const hasInvalidValue = Object.values(scenarioValues).some(
      (value) => !Number.isFinite(Number(value)),
    );

    if (hasInvalidValue) {
      return res.status(400).json({
        success: false,
        message: "All scenario values must be valid numbers.",
      });
    }

    if (Number(discountPercent) < 0 || Number(discountPercent) > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0% and 100%.",
      });
    }

    if (Number(salesChangePercent) < -100) {
      return res.status(400).json({
        success: false,
        message: "Sales change cannot be below -100%.",
      });
    }

    const operationalChanges = [
      rtoChangePercent,
      refundChangePercent,
      paymentFailureChangePercent,
      chargebackChangePercent,
    ];

    if (operationalChanges.some((value) => Number(value) < -100)) {
      return res.status(400).json({
        success: false,
        message: "Operational rate changes cannot be below -100%.",
      });
    }

    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    const transactions = await Transaction.find({
      merchantId,
    });

    if (!transactions.length) {
      return res.status(400).json({
        success: false,
        message: "No transactions found for this merchant",
      });
    }

    // -----------------------------------------
    // 1. Current business metrics
    // -----------------------------------------

    const totalRevenue = transactions.reduce(
      (sum, transaction) => sum + (transaction.amount || 0),
      0,
    );

    const currentOrders = transactions.length;

    // -----------------------------------------
    // 2. Current profit
    // -----------------------------------------

    const currentProfit = transactions.reduce(
      (sum, transaction) => sum + (transaction.settlementAmount || 0),
      0,
    );

    // -----------------------------------------
    // 3. RTO
    // -----------------------------------------

    const rtoCount = transactions.filter(
      (transaction) => transaction.isRTO === true,
    ).length;

    // -----------------------------------------
    // 4. Refund
    // -----------------------------------------

    const refundCount = transactions.filter(
      (transaction) => transaction.isRefunded === true,
    ).length;

    // -----------------------------------------
    // 5. Payment failures
    // -----------------------------------------

    const failedPaymentCount = transactions.filter(
      (transaction) => transaction.transactionStatus === "failed",
    ).length;

    // -----------------------------------------
    // 6. Chargebacks
    // -----------------------------------------

    const chargebackCount = transactions.filter(
      (transaction) => transaction.isChargeback === true,
    ).length;

    // -----------------------------------------
    // 7. Convert to percentages
    // -----------------------------------------

    const currentRTO = (rtoCount / currentOrders) * 100;

    const currentRefundRate = (refundCount / currentOrders) * 100;

    const currentPaymentFailureRate =
      (failedPaymentCount / currentOrders) * 100;

    const currentChargebackRate = (chargebackCount / currentOrders) * 100;

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

      ...req.body,
    });

    const scenarioRisk = calculateRiskScore({
      chargebackRate: result.scenario.chargebackRate,
      refundRate: result.scenario.refundRate,
      rtoRate: result.scenario.rtoRate,
      paymentSuccessRate: 100 - result.scenario.paymentFailureRate,
      averageDailyRevenue: 1,
      averageDailyExpenses: 0,
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
        scenarioRisk,
        advice,
      },
    });
  } catch (error) {
    console.error("What-if analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze what-if scenario",
      error: error.message,
    });
  }
});

module.exports = router;
