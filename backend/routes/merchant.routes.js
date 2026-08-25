const { calculateRiskScore } = require("../services/riskEngine");
const { calculateAnomalies } = require("../services/anomalyEngine");
const { generateRecommendations } = require("../services/recommendationEngine");
const {
  buildMerchantIntelligence,
} = require("../services/merchantIntelligenceEngine");
const { generateAIExplanation } = require("../services/aiExplanationEngine");

const express = require("express");
const Merchant = require("../models/Merchant");
const {
  calculateFinancialImpact,
} = require("../services/financialImpactEngine");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Create Merchant
router.post("/", async (req, res) => {
  try {
    const merchant = await Merchant.create(req.body);

    res.status(201).json({
      success: true,
      message: "Merchant created successfully",
      data: merchant,
    });
  } catch (error) {
    console.error("Merchant creation error:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to create merchant",
      error: error.message,
    });
  }
});

// Analyze Merchant Risk
router.get("/:merchantId/risk", async (req, res) => {
  try {
    const { merchantId } = req.params;

    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    const risk = calculateRiskScore(merchant);

    res.status(200).json({
      success: true,
      message: "Merchant risk analyzed successfully",
      data: {
        merchantId: merchant._id,
        businessName: merchant.businessName,
        risk,
      },
    });
  } catch (error) {
    console.error("Risk analysis error:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to analyze merchant risk",
      error: error.message,
    });
  }
});

// Analyze Financial Impact
router.get("/:merchantId/financial-impact", async (req, res) => {
  try {
    const { merchantId } = req.params;

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

    const financialImpact = calculateFinancialImpact(merchant, transactions);

    res.status(200).json({
      success: true,
      message: "Financial impact calculated successfully",
      data: {
        merchantId: merchant._id,
        businessName: merchant.businessName,
        financialImpact,
      },
    });
  } catch (error) {
    console.error("Financial impact calculation error:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to calculate financial impact",
      error: error.message,
    });
  }
});

// Analyze Merchant Anomalies
router.get("/:merchantId/anomalies", async (req, res) => {
  try {
    const { merchantId } = req.params;

    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    const transactions = await Transaction.find({
      merchantId,
    }).sort({
      transactionDate: 1,
    });

    const anomalyResult = calculateAnomalies(transactions);

    res.status(200).json({
      success: true,
      message: "Merchant anomalies analyzed successfully",
      data: {
        merchantId: merchant._id,
        businessName: merchant.businessName,
        anomalyResult,
      },
    });
  } catch (error) {
    console.error("Anomaly analysis error:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to analyze merchant anomalies",
      error: error.message,
    });
  }
});

// Generate Merchant Recommendations
router.get("/:merchantId/recommendations", async (req, res) => {
  try {
    const { merchantId } = req.params;

    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    const transactions = await Transaction.find({
      merchantId,
    }).sort({
      transactionDate: 1,
    });

    // 1. Risk analysis
    const risk = calculateRiskScore(merchant);

    // 2. Financial analysis
    const financialImpact = calculateFinancialImpact(merchant, transactions);

    // 3. Anomaly analysis
    const anomalyResult = calculateAnomalies(transactions);

    // 4. Generate recommendations
    const recommendationResult = generateRecommendations({
      risk,
      financialImpact,
      anomalies: anomalyResult.anomalies,
    });

    res.status(200).json({
      success: true,
      message: "Merchant recommendations generated successfully",
      data: {
        merchantId: merchant._id,
        businessName: merchant.businessName,

        risk,

        financialImpact,

        anomalies: anomalyResult,

        recommendations: recommendationResult,
      },
    });
  } catch (error) {
    console.error("Recommendation generation error:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to generate recommendations",
      error: error.message,
    });
  }
});

// Generate Complete Merchant Intelligence
router.get("/:merchantId/intelligence", async (req, res) => {
  try {
    const { merchantId } = req.params;

    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    const transactions = await Transaction.find({
      merchantId,
    }).sort({
      transactionDate: 1,
    });

    // 1. Risk analysis
    const risk = calculateRiskScore(merchant);

    // 2. Financial analysis
    const financialImpact = calculateFinancialImpact(merchant, transactions);

    // 3. Anomaly analysis
    const anomalyResult = calculateAnomalies(transactions);

    // 4. Recommendations
    const recommendationResult = generateRecommendations({
      risk,
      financialImpact,
      anomalies: anomalyResult.anomalies,
    });

    // 5. Build unified intelligence
    const intelligence = buildMerchantIntelligence({
      risk,
      financialImpact,
      anomalies: anomalyResult.anomalies,
      recommendations: recommendationResult.recommendations,
    });

    res.status(200).json({
      success: true,
      message: "Merchant intelligence generated successfully",

      data: {
        merchantId: merchant._id,
        businessName: merchant.businessName,

        intelligence,
      },
    });
  } catch (error) {
    console.error("Merchant intelligence error:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to generate merchant intelligence",
      error: error.message,
    });
  }
});

// Generate AI-style Merchant Explanation
router.get("/:merchantId/ai-explanation", async (req, res) => {
  try {
    const { merchantId } = req.params;

    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    const transactions = await Transaction.find({
      merchantId,
    }).sort({
      transactionDate: 1,
    });

    // Risk
    const risk = calculateRiskScore(merchant);

    // Financial impact
    const financialImpact = calculateFinancialImpact(merchant, transactions);

    // Anomalies
    const anomalyResult = calculateAnomalies(transactions);

    // Recommendations
    const recommendationResult = generateRecommendations({
      risk,
      financialImpact,
      anomalies: anomalyResult.anomalies,
    });

    // Unified intelligence
    const intelligence = buildMerchantIntelligence({
      risk,
      financialImpact,
      anomalies: anomalyResult.anomalies,
      recommendations: recommendationResult.recommendations,
    });

    // AI-style explanation
    const aiExplanation = generateAIExplanation({
      businessName: merchant.businessName,
      intelligence,
    });

    res.status(200).json({
      success: true,
      message: "Merchant AI explanation generated successfully",
      data: {
        merchantId: merchant._id,
        businessName: merchant.businessName,
        aiExplanation,
      },
    });
  } catch (error) {
    console.error("AI explanation error:", error.message);

    res.status(400).json({
      success: false,
      message: "Failed to generate AI explanation",
      error: error.message,
    });
  }
});

// ML Risk Prediction
router.get("/:merchantId/ml-risk", async (req, res) => {
  try {
    const { merchantId } = req.params;

    // Find merchant
    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    // Find all transactions for this merchant
    const transactions = await Transaction.find({
      merchantId,
    });

    const transactionVolume = transactions.length;

    // -----------------------------
    // Transaction metrics
    // -----------------------------

    const failedTransactions = transactions.filter(
      (transaction) => transaction.transactionStatus === "failed",
    ).length;

    const rtoTransactions = transactions.filter(
      (transaction) => transaction.isRTO === true,
    ).length;

    const chargebackTransactions = transactions.filter(
      (transaction) => transaction.isChargeback === true,
    ).length;

    const refundedTransactions = transactions.filter(
      (transaction) => transaction.isRefunded === true,
    ).length;

    const codTransactions = transactions.filter(
      (transaction) => transaction.isCOD === true,
    ).length;

    // -----------------------------
    // Calculate rates
    // -----------------------------

    const paymentFailureRate =
      transactionVolume > 0
        ? (failedTransactions / transactionVolume) * 100
        : 0;

    const paymentSuccessRate = 100 - paymentFailureRate;

    const rtoRate =
      transactionVolume > 0 ? (rtoTransactions / transactionVolume) * 100 : 0;

    const chargebackRate =
      transactionVolume > 0
        ? (chargebackTransactions / transactionVolume) * 100
        : 0;

    const refundRate =
      transactionVolume > 0
        ? (refundedTransactions / transactionVolume) * 100
        : 0;

    const codPercentage =
      transactionVolume > 0 ? (codTransactions / transactionVolume) * 100 : 0;

    const averageTransactionValue =
      transactionVolume > 0
        ? transactions.reduce(
            (total, transaction) => total + Number(transaction.amount || 0),
            0,
          ) / transactionVolume
        : 0;

    // -----------------------------
    // Features returned to frontend
    // -----------------------------

    const features = {
      transaction_volume: transactionVolume,
      payment_failure_rate: paymentFailureRate,
      rto_rate: rtoRate,
      chargeback_rate: chargebackRate,
      refund_rate: refundRate,
      cod_percentage: codPercentage,
      average_transaction_value: averageTransactionValue,
    };

    // -----------------------------
    // Calculate risk directly
    // No Python ML service
    // No localhost:8000
    // -----------------------------

    const riskResult = calculateRiskScore({
      chargebackRate,
      refundRate,
      rtoRate,
      paymentSuccessRate,

      // Keep cash-flow component neutral here.
      // Risk is calculated from transaction behaviour.
      averageDailyRevenue: 1,
      averageDailyExpenses: 0,
    });

    // -----------------------------
    // Final response
    // -----------------------------

    return res.status(200).json({
      success: true,
      message: "Merchant ML risk predicted successfully",

      data: {
        merchantId: merchant._id,
        businessName: merchant.businessName,

        features,

        prediction: {
          risk: riskResult.level,
          riskProbability: riskResult.score / 100,
        },

        score: riskResult.score,
        reasons: riskResult.reasons,
      },
    });
  } catch (error) {
    console.error("ML risk prediction error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to predict merchant ML risk",
      error: error.message,
    });
  }
});
module.exports = router;
