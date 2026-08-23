[1mdiff --git a/backend/server.js b/backend/server.js[m
[1mindex bdd4085..b812f02 100644[m
[1m--- a/backend/server.js[m
[1m+++ b/backend/server.js[m
[36m@@ -2,46 +2,96 @@[m [mconst express = require("express");[m
 const cors = require("cors");[m
 const helmet = require("helmet");[m
 const morgan = require("morgan");[m
[31m-const connectDB = require("./config/db");[m
[32m+[m
 require("dotenv").config();[m
 [m
[32m+[m[32mconst connectDB = require("./config/db");[m
[32m+[m
 const app = express();[m
[31m-// Connect MongoDB[m
[32m+[m
[32m+[m[32m// -----------------------------[m
[32m+[m[32m// Database[m
[32m+[m[32m// -----------------------------[m
[32m+[m
 connectDB();[m
 [m
[32m+[m[32m// -----------------------------[m
 // Middleware[m
[31m-app.use(cors());[m
[32m+[m[32m// -----------------------------[m
[32m+[m
[32m+[m[32mapp.use([m
[32m+[m[32m    cors({[m
[32m+[m[32m        origin: true,[m
[32m+[m[32m        credentials: true,[m
[32m+[m[32m    })[m
[32m+[m[32m);[m
[32m+[m
 app.use(helmet());[m
 app.use(morgan("dev"));[m
 app.use(express.json());[m
 [m
[32m+[m[32m// -----------------------------[m
 // Routes[m
[31m-const merchantRoutes = require("./routes/merchant.routes");[m
[32m+[m[32m// -----------------------------[m
 [m
[31m-app.use("/api/merchants", merchantRoutes);[m
[32m+[m[32mconst merchantRoutes =[m
[32m+[m[32m    require("./routes/merchant.routes");[m
 [m
[31m-// Transaction Routes[m
[31m-const transactionRoutes = require("./routes/transaction.routes");[m
[32m+[m[32mconst transactionRoutes =[m
[32m+[m[32m    require("./routes/transaction.routes");[m
 [m
[31m-app.use("/api/transactions", transactionRoutes);[m
[32m+[m[32mconst whatIfRoutes =[m
[32m+[m[32m    require("./routes/whatIf.routes");[m
 [m
[31m-const whatIfRoutes = require("./routes/whatIf.routes");[m
[32m+[m[32mapp.use([m
[32m+[m[32m    "/api/merchants",[m
[32m+[m[32m    merchantRoutes[m
[32m+[m[32m);[m
 [m
[31m-app.use("/api/merchants", whatIfRoutes);[m
[32m+[m[32mapp.use([m
[32m+[m[32m    "/api/transactions",[m
[32m+[m[32m    transactionRoutes[m
[32m+[m[32m);[m
 [m
[32m+[m[32mapp.use([m
[32m+[m[32m    "/api/merchants",[m
[32m+[m[32m    whatIfRoutes[m
[32m+[m[32m);[m
[32m+[m
[32m+[m[32m// -----------------------------[m
 // Health Check[m
[32m+[m[32m// -----------------------------[m
[32m+[m
 app.get("/api/health", (req, res) => {[m
     res.status(200).json({[m
         success: true,[m
         message: "Merchant Autopilot backend is running",[m
[31m-        environment: process.env.NODE_ENV,[m
[31m-        timestamp: new Date().toISOString()[m
[32m+[m[32m        environment:[m
[32m+[m[32m            process.env.NODE_ENV || "development",[m
[32m+[m[32m        timestamp: new Date().toISOString(),[m
[32m+[m[32m    });[m
[32m+[m[32m});[m
[32m+[m
[32m+[m[32m// -----------------------------[m
[32m+[m[32m// Root[m
[32m+[m[32m// -----------------------------[m
[32m+[m
[32m+[m[32mapp.get("/", (req, res) => {[m
[32m+[m[32m    res.json({[m
[32m+[m[32m        success: true,[m
[32m+[m[32m        message: "Merchant Autopilot API is running",[m
     });[m
 });[m
 [m
[32m+[m[32m// -----------------------------[m
 // Start Server[m
[31m-const PORT = process.env.PORT || 5000;[m
[32m+[m[32m// -----------------------------[m
[32m+[m
[32m+[m[32mconst PORT =[m
[32m+[m[32m    process.env.PORT || 5000;[m
 [m
[31m-app.listen(PORT, () => {[m
[31m-    console.log(`Merchant Autopilot API running on port ${PORT}`);[m
[32m+[m[32mapp.listen(PORT, "0.0.0.0", () => {[m
[32m+[m[32m    console.log([m
[32m+[m[32m        `Merchant Autopilot API running on port ${PORT}`[m
[32m+[m[32m    );[m
 });[m
\ No newline at end of file[m
