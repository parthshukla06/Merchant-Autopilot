const { calculateRiskScore } = require("../services/riskEngine");
const { spawn } = require("child_process");
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

    // -----------------------------------------
    // Find merchant
    // -----------------------------------------
    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
    }

    // -----------------------------------------
    // Find transactions
    // -----------------------------------------
    const transactions = await Transaction.find({
      merchantId,
    });

    const transactionVolume = transactions.length;

    if (transactionVolume === 0) {
      return res.status(400).json({
        success: false,
        message: "No transactions found for this merchant",
      });
    }

    // -----------------------------------------
    // Transaction metrics
    // -----------------------------------------

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

    // -----------------------------------------
    // Calculate rates
    // -----------------------------------------

    const paymentFailureRate = (failedTransactions / transactionVolume) * 100;

    const rtoRate = (rtoTransactions / transactionVolume) * 100;

    const chargebackRate = (chargebackTransactions / transactionVolume) * 100;

    const refundRate = (refundedTransactions / transactionVolume) * 100;

    const codPercentage = (codTransactions / transactionVolume) * 100;

    const averageTransactionValue =
      transactions.reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      ) / transactionVolume;

    // -----------------------------------------
    // Features
    // -----------------------------------------

    const features = {
      transaction_volume: transactionVolume,
      payment_failure_rate: Number(paymentFailureRate.toFixed(2)),
      rto_rate: Number(rtoRate.toFixed(2)),
      refund_rate: Number(refundRate.toFixed(2)),
      chargeback_rate: Number(chargebackRate.toFixed(2)),
      cod_percentage: Number(codPercentage.toFixed(2)),
      average_transaction_value: Number(averageTransactionValue.toFixed(2)),
    };

    console.log("ML FEATURES:", features);

    // -----------------------------------------
    // Run Python ML model
    // -----------------------------------------

    const pythonProcess = spawn("python", [
      require("path").join(__dirname, "../ml/predict.py"),
    ]);

    let pythonOutput = "";
    let pythonError = "";

    pythonProcess.stdin.write(JSON.stringify(features));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python ML error:", pythonError);

        return res.status(500).json({
          success: false,
          message: "ML prediction failed",
          error: pythonError,
        });
      }

      try {
        const prediction = JSON.parse(pythonOutput.trim());

        if (prediction.error) {
          return res.status(500).json({
            success: false,
            message: "ML prediction failed",
            error: prediction.error,
          });
        }

        // -----------------------------------------
        // Final response
        // -----------------------------------------

        return res.status(200).json({
          success: true,
          message: "Merchant ML risk predicted successfully",

          data: {
            merchantId: merchant._id,
            businessName: merchant.businessName,

            features,

            prediction: {
              risk: prediction.risk,
              riskProbability: prediction.riskProbability,
              probabilities: prediction.probabilities,
            },

            score: Math.round(prediction.riskProbability * 100),

            reasons: [
              ...(chargebackRate >= 3
                ? [`High chargeback rate (${chargebackRate.toFixed(2)}%)`]
                : []),

              ...(rtoRate >= 10
                ? [`High RTO rate (${rtoRate.toFixed(2)}%)`]
                : []),

              ...(paymentFailureRate >= 8
                ? [
                    `High payment failure rate (${paymentFailureRate.toFixed(2)}%)`,
                  ]
                : []),

              ...(refundRate >= 7
                ? [`High refund rate (${refundRate.toFixed(2)}%)`]
                : []),

              ...(codPercentage >= 40
                ? [`High COD dependency (${codPercentage.toFixed(2)}%)`]
                : []),
            ],
          },
        });
      } catch (parseError) {
        console.error("ML response parse error:", parseError.message);

        console.error("Python output:", pythonOutput);

        return res.status(500).json({
          success: false,
          message: "Invalid ML prediction response",
          error: parseError.message,
        });
      }
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
