const express = require("express");
const Transaction = require("../models/Transaction");
const Merchant = require("../models/Merchant");

const router = express.Router();

// Create Transaction
router.post("/", async (req, res) => {
    try {
        const {
            merchantId,
            transactionId,
            amount,
            paymentMethod,
            transactionStatus,
            orderStatus,
            customerType,
            isCOD,
            isRTO,
            isRefunded,
            isChargeback,
            processingFee,
            settlementAmount,
            transactionDate
        } = req.body;

        // Check merchant exists
        const merchant = await Merchant.findById(merchantId);

        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: "Merchant not found"
            });
        }

        // Create transaction
        const transaction = await Transaction.create({
            merchantId,
            transactionId,
            amount,
            paymentMethod,
            transactionStatus,
            orderStatus,
            customerType,
            isCOD,
            isRTO,
            isRefunded,
            isChargeback,
            processingFee,
            settlementAmount,
            transactionDate
        });

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction
        });

    } catch (error) {
        console.error("Transaction creation error:", error.message);

        res.status(400).json({
            success: false,
            message: "Failed to create transaction",
            error: error.message
        });
    }
});

// Get transactions for a merchant
router.get("/merchant/:merchantId", async (req, res) => {
    try {
        const { merchantId } = req.params;

        // Check merchant exists
        const merchant = await Merchant.findById(merchantId);

        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: "Merchant not found"
            });
        }

        const transactions = await Transaction.find({
            merchantId
        }).sort({ transactionDate: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });

    } catch (error) {
        console.error("Fetching transactions error:", error.message);

        res.status(400).json({
            success: false,
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
});

module.exports = router;