import { useEffect, useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle,
  CircleDollarSign,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  Wallet,
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000";
const MERCHANT_ID = "6a89dccdcc29ecf53a7612f3";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mlRisk, setMlRisk] = useState(null);

  const fetchIntelligence = async () => {
  try {
    setLoading(true);
    setError("");

    const [intelligenceResponse, mlResponse] = await Promise.all([
      axios.get(
        `${API_URL}/api/merchants/${MERCHANT_ID}/intelligence`
      ),
      axios.get(
        `${API_URL}/api/merchants/${MERCHANT_ID}/ml-risk`
      ),
    ]);

    setData(intelligenceResponse.data.data);
    setMlRisk(mlResponse.data.data);
  } catch (err) {
    console.error(err);
    setError(
      "Unable to connect to Merchant Autopilot backend."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchIntelligence();
  }, []);

  if (loading) {
    return (
      <div className="app loading-screen">
        <RefreshCw className="loading-icon" size={28} />
        <h2>Loading Merchant Intelligence...</h2>
        <p>Analyzing business performance</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app loading-screen">
        <ShieldAlert size={40} />
        <h2>Connection Error</h2>
        <p>{error}</p>

        <button className="refresh-button" onClick={fetchIntelligence}>
          <RefreshCw size={18} />
          Retry
        </button>
      </div>
    );
  }

  const { businessName, intelligence } = data;

  const {
    overallPriority,
    executiveSummary,
    keyInsight,
    criticalIssues,
    highPriorityIssues,
    financialOverview,
    topRecommendations,
  } = intelligence;

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">
            <ShieldAlert size={25} />
            <span>Merchant Autopilot</span>
          </div>

          <p className="subtitle">AI-powered merchant intelligence</p>
        </div>

        <button className="refresh-button" onClick={fetchIntelligence}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </header>

      <main className="dashboard">
        <section className="welcome">
          <div>
            <p className="eyebrow">BUSINESS OVERVIEW</p>
            <h1>{businessName}</h1>
            <p className="summary">{executiveSummary}</p>
          </div>

          <div className={`priority-badge ${overallPriority}`}>
            <AlertTriangle size={18} />
            {overallPriority.toUpperCase()} PRIORITY
          </div>
        </section>

        <section className="metrics-grid">
          <MetricCard
            icon={<CircleDollarSign />}
            label="Total Financial Exposure"
            value={`₹${financialOverview.totalFinancialExposure.toLocaleString(
              "en-IN",
            )}`}
            description="Identified exposure"
          />

          <MetricCard
            icon={<Wallet />}
            label="Money At Risk"
            value={`₹${financialOverview.confirmedMoneyAtRisk.toLocaleString(
              "en-IN",
            )}`}
            description="Confirmed financial risk"
          />

          <MetricCard
            icon={<TrendingUp />}
            label="Recoverable Opportunity"
            value={`₹${financialOverview.recoverableOpportunity.toLocaleString(
              "en-IN",
            )}`}
            description="Potential recovery"
          />

          <MetricCard
            icon={<ArrowUpRight />}
            label="Business Priority"
            value={overallPriority.toUpperCase()}
            description="Current intelligence level"
          />

          <div className={`metric-card ml-risk-card ${mlRisk?.prediction?.risk || ""}`}>
  <div className="metric-icon">
    <ShieldAlert />
  </div>

  <p>ML Risk Prediction</p>

  <h2>
    {mlRisk?.prediction?.risk?.toUpperCase() || "N/A"}
  </h2>

  <span>
    {mlRisk
      ? `${Math.round(
          mlRisk.prediction.riskProbability * 100
        )}% confidence`
      : "Analyzing..."}
  </span>
</div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">DETECTED ISSUES</p>
                <h2>Business Anomalies</h2>
              </div>

              <AlertTriangle size={22} />
            </div>

            {criticalIssues.length > 0 && (
              <div className="issue-section">
                <h3 className="critical-title">Critical</h3>

                {criticalIssues.map((issue, index) => (
                  <Issue
                    key={`critical-${index}`}
                    issue={issue}
                    severity="critical"
                  />
                ))}
              </div>
            )}

            {highPriorityIssues.length > 0 && (
              <div className="issue-section">
                <h3 className="high-title">High Priority</h3>

                {highPriorityIssues.map((issue, index) => (
                  <Issue key={`high-${index}`} issue={issue} severity="high" />
                ))}
              </div>
            )}
          </div>

          <div className="panel insight-panel">
            <p className="eyebrow">KEY INSIGHT</p>

            <h2>Where is the money going?</h2>

            <div className="insight-box">
              <CircleDollarSign size={25} />
              <p>{keyInsight}</p>
            </div>

            <div className="exposure">
              <span>Total exposure</span>
              <strong>
                ₹
                {financialOverview.totalFinancialExposure.toLocaleString(
                  "en-IN",
                )}
              </strong>
            </div>
          </div>
        </section>

        <section className="panel recommendations-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">AUTOPILOT ACTION PLAN</p>
              <h2>Recommended Actions</h2>
            </div>

            <CheckCircle size={22} />
          </div>

          <div className="recommendations">
            {topRecommendations.map((recommendation, index) => (
              <div className="recommendation" key={index}>
                <div className="recommendation-number">{index + 1}</div>

                <div className="recommendation-content">
                  <div className="recommendation-title">
                    <h3>{recommendation.title}</h3>

                    <span className={`priority-tag ${recommendation.priority}`}>
                      {recommendation.priority}
                    </span>
                  </div>

                  <p>{recommendation.action}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({ icon, label, value, description }) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>

      <p>{label}</p>

      <h2>{value}</h2>

      <span>{description}</span>
    </div>
  );
}

function Issue({ issue, severity }) {
  return (
    <div className={`issue ${severity}`}>
      <div className="issue-icon">
        <AlertTriangle size={18} />
      </div>

      <div className="issue-content">
        <strong>{issue.message}</strong>

        <span>
          Change: <b>+{issue.change}%</b>
        </span>
      </div>
    </div>
  );
}

export default App;
