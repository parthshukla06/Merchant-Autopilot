const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        merchantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Merchant",
            required: true,
            index: true
        },

        transactionId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            enum: [
                "upi",
                "card",
                "netbanking",
                "wallet",
                "cod"
            ],
            required: true
        },

        transactionStatus: {
            type: String,
            enum: [
                "pending",
                "success",
                "failed",
                "refunded",
                "disputed",
                "cancelled"
            ],
            required: true
        },

        orderStatus: {
            type: String,
            enum: [
                "placed",
                "confirmed",
                "shipped",
                "delivered",
                "returned",
                "cancelled"
            ],
            default: "placed"
        },

        customerType: {
            type: String,
            enum: ["new", "returning"],
            default: "new"
        },

        isCOD: {
            type: Boolean,
            default: false
        },

        isRTO: {
            type: Boolean,
            default: false
        },

        isRefunded: {
            type: Boolean,
            default: false
        },

        isChargeback: {
            type: Boolean,
            default: false
        },

        processingFee: {
            type: Number,
            default: 0
        },

        settlementAmount: {
            type: Number,
            default: 0
        },

        transactionDate: {
            type: Date,
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);