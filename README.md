# 🚀 Merchant Autopilot

### AI-Powered Merchant Risk & Decision Intelligence Platform

Merchant Autopilot is a full-stack business intelligence platform designed to help merchants understand operational risks, simulate business decisions, and receive actionable recommendations.

The system combines **real-time merchant analytics, ML-based risk prediction, What-If scenario simulation, and AI-powered business advice** in a single dashboard.

---

## 🎯 Problem Statement

Online merchants deal with multiple operational risks such as:

- Return-to-Origin (RTO)
- Refunds
- Payment failures
- Chargebacks
- Revenue fluctuations
- Discount costs
- Profit uncertainty

Traditional dashboards mainly show historical data.

**Merchant Autopilot goes one step further by answering:**

> "What will happen to my business if I change this?"

For example:

- What if sales increase by 15%?
- What if RTO decreases by 20%?
- What if refunds decrease by 30%?
- What if payment failures decrease by 40%?
- What if chargebacks decrease by 25%?
- Will the scenario improve profitability?

---

# ✨ Key Features

## 📊 Business Intelligence Dashboard

Provides a centralized view of merchant performance including:

- Total revenue
- Profit
- Orders
- Operational risk
- RTO
- Refunds
- Payment failures
- Chargebacks
- Critical business issues
- Key business insights

---

## 🔮 What-If Simulator

The What-If Simulator allows merchants to modify business parameters and instantly evaluate the potential impact.

### Supported Scenario Inputs

| Parameter | Description |
|---|---|
| Discount % | Simulates the effect of discounts |
| Sales Change % | Simulates sales growth or decline |
| RTO Change % | Simulates RTO improvement/deterioration |
| Refund Change % | Simulates refund rate changes |
| Payment Failure % | Simulates payment failure changes |
| Chargeback % | Simulates chargeback changes |

The engine calculates:

- Scenario revenue
- Scenario profit
- Scenario orders
- Scenario risk rates
- Revenue change
- Profit change
- Additional orders
- Discount cost
- Estimated recovery
- RTO recovery
- Refund recovery
- Payment recovery
- Chargeback recovery
- Final recommendation

### Example

```text
Current RTO       → 10.48%
Scenario RTO      → 8.38%

Current Refund    → 8.00%
Scenario Refund   → 6.00%

Current Profit    → ₹X
Scenario Profit   → ₹Y

The system then determines whether the scenario is:

RECOMMENDED
NEUTRAL
NOT RECOMMENDED

🤖 ML-Based Risk Prediction

Merchant Autopilot includes an ML pipeline for merchant risk analysis.

The ML workflow includes:

Transaction Data
       ↓
Dataset Generation
       ↓
Feature Preparation
       ↓
Model Training
       ↓
Risk Prediction
       ↓
Merchant Risk Score
ML Components
backend/ml/
├── generateDataset.js
├── merchant-risk-dataset.csv
├── merchant-risk-dataset.json
├── predict.py
├── train_model.py
└── risk_model.pkl

The trained model is used to support merchant risk intelligence.

🧠 AI Business Advisor

After running a What-If scenario, Merchant Autopilot generates business advice based on the calculated scenario.

The advisor provides sections such as:

Summary
Financial Impact
Recommendation
Explanation
Next Step

The system can identify whether the scenario is beneficial and provide decision-oriented guidance.

The dashboard also indicates whether the advice was:

AI GENERATED

or

RULE BASED
📈 Scenario Analytics

The analytics section compares current business performance with the simulated scenario.

Financial Comparison

Compares:

Revenue
Profit
Orders
Operational Risk Comparison

Compares:

RTO
Refund
Payment Failure
Chargeback
Risk Distribution

Displays:

Current operational risk
Scenario operational risk

This allows merchants to visually understand how a decision affects their business.

🏗️ System Architecture

                         ┌──────────────────────┐
                         │      Frontend        │
                         │      React + Vite    │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │       Backend        │
                         │   Node.js + Express  │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐      ┌──────────────┐      ┌──────────────┐
       │  MongoDB    │      │ What-If      │      │ Risk Engine  │
       │ Transactions│      │ Engine       │      │              │
       └─────────────┘      └──────────────┘      └──────┬───────┘
                                                         │
                                                         ▼
                                                  ┌──────────────┐
                                                  │ ML Pipeline  │
                                                  └──────┬───────┘
                                                         │
                                                         ▼
                                                  ┌──────────────┐
                                                  │ AI Advisor   │
                                                  └──────────────┘

🛠️ Tech Stack
Frontend
React
Vite
Axios
CSS
JavaScript
Backend
Node.js
Express.js
MongoDB
Mongoose
REST APIs
Machine Learning
Python
Scikit-learn
Dataset generation
Model training
Risk prediction
AI
AI-powered business advice
Rule-based fallback
Scenario-based decision analysis
📁 Project Structure
Merchant-Autopilot/
│
├── backend/
│   │
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── ml/
│   │   ├── generateDataset.js
│   │   ├── merchant-risk-dataset.csv
│   │   ├── merchant-risk-dataset.json
│   │   ├── predict.py
│   │   ├── train_model.py
│   │   └── risk_model.pkl
│   │
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── AnalyticsCharts.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── ...
│
├── .gitignore
└── README.md


⚙️ Installation
1. Clone Repository
git clone parthshukla06/Merchant-Autopilot

cd Merchant-Autopilot

2. Backend Setup
cd backend
npm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string

Start the backend:

npm run dev
3. Frontend Setup

Open another terminal:

cd frontend
npm install
npm run dev

The frontend will run on the Vite development server.

🔌 API
Merchant Intelligence
GET /api/merchants/:merchantId/intelligence

Returns merchant analytics and intelligence data.

What-If Analysis
POST /api/merchants/:merchantId/what-if
Request
{
  "discountPercent": 10,
  "salesChangePercent": 15,
  "rtoChangePercent": -20,
  "refundChangePercent": -15,
  "paymentFailureChangePercent": -20,
  "chargebackChangePercent": -10
}
Response

The API returns:

Current metrics
Scenario metrics
Scenario risk
Financial impact
Recovery estimates
Recommendation
AI business advice
🔐 Input Validation

The What-If API validates scenario inputs before processing.

Examples:

Discount: 0% – 100%
Sales change: minimum -100%
Operational changes: minimum -100%

Invalid values are rejected by the backend.

📊 Business Logic

The What-If engine calculates scenario values using the merchant's current metrics.

Orders
New Orders =
Current Orders × (1 + Sales Change / 100)
Revenue
New Revenue =
Current Revenue × (1 + Sales Change / 100)
Discount Cost
Discount Cost =
New Revenue × Discount / 100
Revenue After Discount
Revenue After Discount =
New Revenue - Discount Cost

Operational rates are then adjusted according to the scenario changes.

Recovery estimates are calculated from improvements in:

RTO
Refunds
Payment failures
Chargebacks

Finally, the system calculates:

Scenario Profit
Profit Change
Recommendation
🧪 Scenario Testing

The application has been tested with:

Positive sales growth
Negative sales growth
Discount changes
RTO improvements
Refund improvements
Payment failure improvements
Chargeback improvements
Invalid input values
Multiple scenario runs
Dynamic analytics updates
🎯 Project Goals

Merchant Autopilot aims to transform merchant analytics from:

"What happened?"

into:

"What could happen?"

and ultimately:

"What should I do?"
🚀 Future Improvements

Potential future enhancements include:

Automated merchant alerts
Historical scenario tracking
Advanced ML risk models
Merchant-level personalization
Time-series forecasting
Automated recommendations
Multi-merchant management
Cloud deployment
Role-based authentication
Advanced financial forecasting
👨‍💻 Author

Parth Shukla

Full Stack Developer | MERN Stack | AI & ML

⭐ Why Merchant Autopilot?

Merchant Autopilot combines:

Full-Stack Development
        +
Data Analytics
        +
Machine Learning
        +
AI
        +
Business Decision Intelligence

into a single practical application designed around real-world merchant problems.

