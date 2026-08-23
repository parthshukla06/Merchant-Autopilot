const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
const merchantRoutes = require("./routes/merchant.routes");

app.use("/api/merchants", merchantRoutes);

// Transaction Routes
const transactionRoutes = require("./routes/transaction.routes");

app.use("/api/transactions", transactionRoutes);

const whatIfRoutes = require("./routes/whatIf.routes");

app.use("/api/merchants", whatIfRoutes);

// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Merchant Autopilot backend is running",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Merchant Autopilot API running on port ${PORT}`);
});