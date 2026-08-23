const mongoose = require("mongoose");

const financialEventSchema = new mongoose.Schema(
    {
        merchantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Merchant",
            required: true,
            index: true
        },

        eventType: {
            type: String,
            enum: [
                "RTO_SPIKE",
                "REFUND_SURGE",
                "PAYMENT_FAILURE_SPIKE",
                "CHARGEBACK_SPIKE",
                "SETTLEMENT_DELAY",
                "CASH_FLOW_RISK",
                "REVENUE_DROP",
                "UNUSUAL_TRANSACTION_PATTERN"
            ],
            required: true
        },

        severity: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        detectedValue: {
            type: Number,
            default: null
        },

        expectedValue: {
            type: Number,
            default: null
        },

        financialImpact: {
            type: Number,
            default: 0
        },

        confidenceScore: {
            type: Number,
            min: 0,
            max: 1,
            default: 0
        },

        detectedAt: {
            type: Date,
            default: Date.now,
            index: true
        },

        resolved: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "FinancialEvent",
    financialEventSchema
);