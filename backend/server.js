const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// -----------------------------
// Database
// -----------------------------

connectDB();

// -----------------------------
// Middleware
// -----------------------------

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// -----------------------------
// Routes
// -----------------------------

const merchantRoutes =
    require("./routes/merchant.routes");

const transactionRoutes =
    require("./routes/transaction.routes");

const whatIfRoutes =
    require("./routes/whatIf.routes");

app.use(
    "/api/merchants",
    merchantRoutes
);

app.use(
    "/api/transactions",
    transactionRoutes
);

app.use(
    "/api/merchants",
    whatIfRoutes
);

// -----------------------------
// Health Check
// -----------------------------

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Merchant Autopilot backend is running",
        environment:
            process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
    });
});

// -----------------------------
// Root
// -----------------------------

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Merchant Autopilot API is running",
    });
});

// -----------------------------
// Start Server
// -----------------------------

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Merchant Autopilot API running on port ${PORT}`
    );
});