require("dotenv").config();

const mongoose = require("mongoose");
const Merchant = require("../models/Merchant");
const Transaction = require("../models/Transaction");

const MERCHANT_ID = "6a89dccdcc29ecf53a7612f3";

async function generateDemoData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // Create demo merchant if it does not exist
        let merchant = await Merchant.findById(MERCHANT_ID);

        if (!merchant) {
            merchant = await Merchant.create({
                _id: MERCHANT_ID,
                businessName: "UrbanCart India",
                businessType: "ecommerce",
                city: "New Delhi",
                state: "Delhi",
                cashBalance: 250000,
                averageDailyRevenue: 85000,
                averageDailyExpenses: 60000,
                paymentSuccessRate: 96,
                refundRate: 3,
                chargebackRate: 1,
                rtoRate: 5,
                status: "healthy"
            });

            console.log("Demo merchant created");
        } else {
            console.log("Demo merchant already exists");
        }

        // Remove previous generated demo transactions
        await Transaction.deleteMany({
            merchantId: MERCHANT_ID,
            transactionId: { $regex: /^DEMO-/ }
        });

        const transactions = [];
        const now = new Date();

        for (let day = 13; day >= 0; day--) {
            const date = new Date(now);
            date.setDate(now.getDate() - day);

            // First 7 days = healthy
            // Last 7 days = deteriorating
            const isProblemPeriod = day < 7;

            for (let i = 0; i < 15; i++) {
                const transactionDate = new Date(date);

                transactionDate.setHours(
                    9 + Math.floor(Math.random() * 10),
                    Math.floor(Math.random() * 60),
                    0,
                    0
                );

                const amount =
                    1000 + Math.floor(Math.random() * 9000);

                let isRTO = false;
                let isChargeback = false;
                let isRefunded = false;
                let transactionStatus = "success";
                let orderStatus = "delivered";

                const random = Math.random();

                if (isProblemPeriod) {
                    if (random < 0.25) {
                        isRTO = true;
                        orderStatus = "returned";
                    } else if (random < 0.40) {
                        transactionStatus = "failed";
                        orderStatus = "cancelled";
                    } else if (random < 0.48) {
                        isChargeback = true;
                        transactionStatus = "disputed";
                    } else if (random < 0.58) {
                        isRefunded = true;
                        transactionStatus = "refunded";
                    }
                } else {
                    if (random < 0.04) {
                        isRTO = true;
                        orderStatus = "returned";
                    } else if (random < 0.07) {
                        transactionStatus = "failed";
                        orderStatus = "cancelled";
                    } else if (random < 0.08) {
                        isRefunded = true;
                        transactionStatus = "refunded";
                    }
                }

                transactions.push({
                    merchantId: MERCHANT_ID,

                    transactionId:
                        `DEMO-${day}-${i}-${Date.now()}-${Math.floor(
                            Math.random() * 100000
                        )}`,

                    amount,

                    paymentMethod:
                        Math.random() < 0.6
                            ? "upi"
                            : "card",

                    transactionStatus,
                    orderStatus,

                    customerType:
                        Math.random() < 0.65
                            ? "returning"
                            : "new",

                    isCOD: Math.random() < 0.35,

                    isRTO,
                    isRefunded,
                    isChargeback,

                    processingFee:
                        Number((amount * 0.02).toFixed(2)),

                    settlementAmount:
                        transactionStatus === "success"
                            ? Number((amount * 0.98).toFixed(2))
                            : 0,

                    transactionDate
                });
            }
        }

        await Transaction.insertMany(transactions);

        console.log(
            `Created ${transactions.length} demo transactions`
        );

        console.log("Demo data generation complete");

        await mongoose.disconnect();

    } catch (error) {
        console.error(
            "Demo data generation failed:",
            error.message
        );

        process.exit(1);
    }
}

generateDemoData();