# Merchant Autopilot

> AI-powered merchant intelligence and risk monitoring platform for detecting business risks, analyzing transaction behaviour, and helping merchants make better decisions.

## 🚀 Live Demo

https://merchant-autopilot-6.onrender.com

## 📂 GitHub Repository

https://github.com/parthshukla06/Merchant-Autopilot

---

## 📌 Overview

Merchant Autopilot is a full-stack merchant intelligence platform designed to help businesses monitor their financial and transaction health.

The system analyzes merchant transactions and generates:

- Merchant risk scores
- Risk levels
- Risk reasons
- Transaction behaviour insights
- ML-style risk predictions
- What-if scenario analysis
- Business recommendations
- Financial impact insights

The goal is to convert raw merchant transaction data into actionable business intelligence.

---

## 🎯 Problem Statement

Merchants generate large amounts of transaction data, but identifying business risks manually can be difficult.

Problems such as:

- High chargebacks
- Increasing refunds
- High Return-to-Origin (RTO)
- Payment failures
- Poor cash flow
- Unusual transaction behaviour

can negatively affect business performance.

Merchant Autopilot analyzes these signals and provides a centralized dashboard for monitoring merchant health and risk.

---

## ✨ Key Features

### 📊 Merchant Intelligence Dashboard

Provides a centralized view of merchant performance and business health.

### ⚠️ Risk Analysis

Calculates merchant risk based on important business indicators including:

- Chargeback rate
- Refund rate
- RTO rate
- Payment success rate
- Cash-flow conditions

Risk levels are classified as:

- Healthy
- Warning
- Critical

### 🤖 ML Risk Prediction

The system analyzes transaction-level features such as:

- Transaction volume
- Payment failure rate
- RTO rate
- Chargeback rate
- Refund rate
- COD percentage
- Average transaction value

and generates a predicted risk level, score, and reasons.

### 🔍 Transaction Analysis

Transaction data is analyzed to identify patterns and calculate merchant-level performance metrics.

### 🧪 What-If Analysis

Allows merchants to evaluate potential scenarios and understand how changes in business conditions can affect risk and financial outcomes.

### 💡 Recommendations

The system generates actionable recommendations based on detected merchant risks.

### 📈 Financial Impact Analysis

Identifies potential financial impact associated with merchant risk factors.

### 🚨 Anomaly Detection

Transaction behaviour can be analyzed for unusual patterns and potential anomalies.

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │      Dashboard      │
                    └──────────┬──────────┘
                               │
                               │ HTTP / Axios
                               ▼
                    ┌─────────────────────┐
                    │   Node.js + Express │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      ┌────────────┐    ┌──────────────┐   ┌──────────────┐
      │  MongoDB   │    │ Risk Engine  │   │ Intelligence │
      │    Atlas   │    │              │   │   Services   │
      └────────────┘    └──────────────┘   └──────────────┘
```
---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Security & Middleware

- Helmet
- CORS
- Morgan
- dotenv

### Deployment

- Render
- MongoDB Atlas

---

## 📁 Project Structure

```text
Merchant-Autopilot/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── Merchant.js
│   │   └── Transaction.js
│   │
│   ├── routes/
│   │   ├── merchant.routes.js
│   │   ├── transaction.routes.js
│   │   └── whatIf.routes.js
│   │
│   ├── services/
│   │   ├── riskEngine.js
│   │   ├── anomalyEngine.js
│   │   ├── recommendationEngine.js
│   │   ├── merchantIntelligenceEngine.js
│   │   ├── financialImpactEngine.js
│   │   ├── aiExplanationEngine.js
│   │   └── mlService.js
│   │
│   ├── scripts/
│   │   └── generateDemoData.js
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── README.md

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/parthshukla06/Merchant-Autopilot.git
cd Merchant-Autopilot
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
NODE_ENV=production
```

Start the backend:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on the Vite development server.

### 4. Production Build

To create the production frontend build:

```bash
npm run build
```

The generated production files will be available inside:

```text
frontend/dist/
```

---

## 🔐 Environment Variables

Do not commit sensitive credentials such as database connection strings or API keys to GitHub.

Example:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
NODE_ENV=production
```

Make sure `.env` is included in `.gitignore`.

---

---

## 🔌 API Endpoints

### Health Check

```http
GET /api/health
```

Checks whether the backend API is running.

### Merchant Intelligence

```http
GET /api/merchants/:merchantId/intelligence
```

Returns merchant intelligence, risk information, recommendations, anomalies, and financial insights.

### Merchant Risk

```http
GET /api/merchants/:merchantId/risk
```

Calculates the merchant's overall business risk.

### ML Risk Prediction

```http
GET /api/merchants/:merchantId/ml-risk
```

Analyzes transaction-level features and returns:

- Risk prediction
- Risk score
- Risk reasons
- Calculated transaction features

### What-If Analysis

```http
POST /api/merchants/:merchantId/what-if
```

Evaluates hypothetical business scenarios and their potential impact.

### Transactions

```http
GET /api/transactions
```

Retrieves transaction data used for merchant analysis.

---

## 🧠 Risk Calculation

Merchant Autopilot calculates a risk score using multiple business indicators.

### Risk Factors

| Factor | Impact |
|---|---|
| Chargeback Rate | High chargebacks increase risk |
| Refund Rate | Frequent refunds increase risk |
| RTO Rate | High RTO indicates delivery/order issues |
| Payment Success Rate | Low success rate increases risk |
| Cash Flow | Low or negative profit increases risk |

### Risk Levels

- 🟢 **Healthy** — Low business risk
- 🟡 **Warning** — Moderate business risk
- 🔴 **Critical** — High business risk

The risk engine combines these factors into a score between `0` and `100`.

Higher scores indicate higher merchant risk.

---

---

## 🧪 Demo Data

Merchant Autopilot includes a demo data generation script for testing and demonstrating the platform.

The script generates transaction data for a merchant across multiple days with both healthy and deteriorating business periods.

Demo transactions include conditions such as:

- Successful transactions
- Failed payments
- Refunds
- Chargebacks
- RTO transactions
- COD transactions

To generate demo transactions:

```bash
cd backend
node scripts/generateDemoData.js
```

This allows the dashboard and risk analysis features to be tested with realistic transaction scenarios.

---

---

## 🚀 Deployment

The application is deployed using Render.

### Frontend

The React frontend is deployed as a production build.

### Backend

The Node.js and Express backend is deployed as a web service.

### Database

MongoDB Atlas is used as the cloud database.

### Live Application

https://merchant-autopilot-6.onrender.com

> Make sure all required environment variables are configured in the deployment platform before starting the application.

---

---

## 📊 Example Risk Analysis

The platform can identify multiple risk signals from merchant transaction data.

Example:

```text
Transaction Volume      : 210
Payment Failure Rate    : 8.57%
RTO Rate                : 10.48%
Chargeback Rate         : 3.33%
Refund Rate             : 7.62%
COD Percentage          : 41.43%
Average Transaction     : ₹5,663.83

Risk Prediction         : WARNING
Risk Score              : 58
```

Identified risk factors may include:

- High chargeback rate
- Elevated refund rate
- Elevated RTO rate
- Low payment success rate

---

## 🔄 Application Flow

```text
User opens dashboard
        │
        ▼
Frontend requests merchant data
        │
        ▼
Express API receives request
        │
        ▼
MongoDB provides merchant & transaction data
        │
        ▼
Risk & intelligence engines analyze data
        │
        ├───────────────┐
        ▼               ▼
Risk Analysis      Recommendations
        │               │
        └───────┬───────┘
                ▼
        Frontend Dashboard
                │
                ▼
       Actionable Business Insights
```

---

## 📌 Project Highlights

- Full-stack MERN-based application
- Merchant-focused risk monitoring
- Transaction-level business analysis
- Automated risk scoring
- ML-style merchant risk prediction
- What-if business scenario analysis
- Financial impact analysis
- Anomaly detection
- Actionable recommendations
- Cloud deployment with Render
- MongoDB Atlas integration
- Responsive dashboard interface

---

## 🔮 Future Improvements

The platform can be extended with:

- Real machine-learning model deployment
- Real-time transaction monitoring
- Advanced fraud detection
- Automated merchant alerts
- Email and notification integration
- Historical risk trend visualization
- More advanced financial forecasting
- Role-based authentication
- Merchant onboarding
- Automated report generation
- Payment gateway integrations

---

## 👨‍💻 Developer

**Parth Shukla**

B.Tech Computer Science Student

### Connect

- GitHub: https://github.com/parthshukla06

---

## 📄 License

This project is developed for educational, demonstration, and portfolio purposes.

---

## ⭐ Acknowledgement

Merchant Autopilot was developed as a full-stack project to demonstrate practical implementation of:

- React.js
- Node.js
- Express.js
- MongoDB
- REST APIs
- Risk analysis
- Business intelligence
- Data-driven decision making

If you find this project useful, consider giving the repository a ⭐ on GitHub.