const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema(
    {
        businessName: {
            type: String,
            required: true,
            trim: true
        },

        businessType: {
            type: String,
            required: true,
            enum: [
                "ecommerce",
                "retail",
                "restaurant",
                "services",
                "subscription",
                "other"
            ]
        },

        city: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        cashBalance: {
            type: Number,
            default: 0
        },

        averageDailyRevenue: {
            type: Number,
            default: 0
        },

        averageDailyExpenses: {
            type: Number,
            default: 0
        },

        paymentSuccessRate: {
            type: Number,
            default: 100
        },

        refundRate: {
            type: Number,
            default: 0
        },

        chargebackRate: {
            type: Number,
            default: 0
        },

        rtoRate: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["healthy", "warning", "critical"],
            default: "healthy"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Merchant", merchantSchema);