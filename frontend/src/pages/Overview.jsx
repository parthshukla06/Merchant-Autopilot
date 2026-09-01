import { useEffect, useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  Wallet,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "https://merchant-autopilot.onrender.com";
const MERCHANT_ID = "6a89dccdcc29ecf53a7612f3";

function Overview() {
  const [data, setData] = useState(null);
  const [mlRisk, setMlRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [intelligenceResponse, mlResponse] = await Promise.all([
        axios.get(`${API_URL}/api/merchants/${MERCHANT_ID}/intelligence`),
        axios.get(`${API_URL}/api/merchants/${MERCHANT_ID}/ml-risk`),
      ]);

      setData(intelligenceResponse.data.data);
      setMlRisk(mlResponse.data.data);
    } catch (err) {
      console.error("Overview error:", err);
      setError("Unable to connect to Merchant Autopilot backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-state">
        <RefreshCw className="spin" size={28} />
        <h2>Loading merchant intelligence...</h2>
        <p>Analyzing business performance</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-state">
        <ShieldAlert size={40} />
        <h2>Connection Error</h2>
        <p>{error}</p>

        <button className="primary-button" onClick={fetchData}>
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (!data?.intelligence) return null;

  const { businessName, intelligence } = data;

  const {
    overallPriority,
    executiveSummary,
    keyInsight,
    criticalIssues = [],
    highPriorityIssues = [],
    financialOverview,
    topRecommendations = [],
  } = intelligence;

  const risk = mlRisk?.prediction?.risk || "N/A";
  const probability = mlRisk?.prediction?.riskProbability;

  const formatMoney = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const allIssues = [...criticalIssues, ...highPriorityIssues];

  return (
    <div className="page overview-page">
      {/* HEADER */}
      <header className="page-header overview-header">
        <div>
          <p className="eyebrow">MERCHANT OVERVIEW</p>
          <h1>{businessName}</h1>

          <p className="page-subtitle">
            Monitor merchant health, financial exposure and operational risk.
          </p>
        </div>

        <button
          className="icon-button"
          onClick={fetchData}
          title="Refresh merchant intelligence"
          aria-label="Refresh merchant intelligence"
        >
          <RefreshCw size={18} />
        </button>
      </header>

      {/* BUSINESS HEALTH */}
      <section className={`hero-card ${overallPriority}`}>
        <div className="hero-health-icon">
          <ShieldAlert size={34} />
        </div>

        <div>
          <div className="hero-label">
            <span className={`priority-dot ${overallPriority}`} />
            BUSINESS HEALTH
          </div>

          <h2>{executiveSummary}</h2>

          <p>{keyInsight}</p>
        </div>

        <div className={`hero-priority ${overallPriority}`}>
          <ShieldAlert size={17} />
          {overallPriority.toUpperCase()}
        </div>
      </section>

      {/* FINANCIAL SNAPSHOT */}
      <section className="stats-grid">
        <StatCard
          icon={<CircleDollarSign />}
          label="Financial Exposure"
          value={formatMoney(financialOverview.totalFinancialExposure)}
          description="Identified exposure"
        />

        <StatCard
          icon={<Wallet />}
          label="Money At Risk"
          value={formatMoney(financialOverview.confirmedMoneyAtRisk)}
          description="Confirmed financial risk"
          danger
        />

        <StatCard
          icon={<TrendingUp />}
          label="Recoverable Opportunity"
          value={formatMoney(financialOverview.recoverableOpportunity)}
          description="Potential recovery"
          success
        />

        <StatCard
          icon={<ArrowUpRight />}
          label="Business Priority"
          value={overallPriority.toUpperCase()}
          description="Current intelligence level"
        />
      </section>

      {/* RISK + ISSUES */}
      <section className="dashboard-grid">
        {/* RISK INTELLIGENCE */}
        <div className="panel overview-panel">
          <PanelHeader
            eyebrow="AI RISK SIGNAL"
            title="Risk intelligence"
            icon={<ShieldAlert />}
          />

          <div className={`risk-summary ${risk}`}>
            <div className="risk-score">
              <span>Current score</span>

              <div className="score-value">
                <strong>{mlRisk?.score ?? "--"}</strong>
                <small>/ 100</small>
              </div>
            </div>

            <div className="risk-level">
              <span className="muted-label">Predicted level</span>

              <h3>{risk.toUpperCase()}</h3>

              <p>
                {probability !== undefined
                  ? `${Math.round(probability * 100)}% prediction confidence`
                  : "Prediction available"}
              </p>
            </div>
          </div>

          <div className="panel-link">
            <Link to="/risk">
              <span>View detailed risk intelligence</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* BUSINESS ANOMALIES */}
        <div className="panel overview-panel">
          <PanelHeader
            eyebrow="DETECTED ISSUES"
            title="Business anomalies"
            icon={<AlertTriangle />}
          />

          <div className="issue-list">
            {allIssues.slice(0, 4).map((issue, index) => (
              <div className="issue-row" key={index}>
                <span className="issue-icon">
                  <AlertTriangle size={15} />
                </span>

                <div>
                  <strong>{issue.title || issue.name || issue}</strong>

                  <span>{issue.description || "Requires attention"}</span>
                </div>
              </div>
            ))}

            {allIssues.length === 0 && (
              <div className="empty-state">
                <CheckCircle2 size={20} />
                <span>No major issues detected.</span>
              </div>
            )}
          </div>

          <div className="panel-link">
            <Link to="/risk">
              <span>View all issues</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* RECOMMENDED ACTIONS */}
      <section className="panel recommendation-panel">
        <PanelHeader
          eyebrow="AUTOPILOT ACTION PLAN"
          title="Recommended actions"
          icon={<CheckCircle2 />}
        />

        <div className="recommendation-grid">
          {topRecommendations.slice(0, 3).map((recommendation, index) => (
            <div className="recommendation-card" key={index}>
              <div className="recommendation-number">{index + 1}</div>

              <div className="recommendation-body">
                <div className="recommendation-title">
                  <strong>{recommendation.title}</strong>

                  <span
                    className={`priority-tag ${recommendation.priority || ""}`}
                  >
                    {recommendation.priority || "ACTION"}
                  </span>
                </div>

                <p>{recommendation.action}</p>
              </div>
            </div>
          ))}

          {topRecommendations.length === 0 && (
            <div className="empty-state">
              <CheckCircle2 size={20} />
              <span>No recommendations available.</span>
            </div>
          )}
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="quick-actions">
        <Link to="/what-if" className="quick-action">
          <div className="quick-action-content">
            <FlaskIcon />

            <div>
              <strong>Run a What-If Scenario</strong>
              <span>Test business changes before acting.</span>
            </div>
          </div>

          <ChevronRight size={20} />
        </Link>

        <Link to="/ai-advisor" className="quick-action">
          <div className="quick-action-content">
            <Sparkles />

            <div>
              <strong>Ask AI Advisor</strong>
              <span>Get an AI-powered business recommendation.</span>
            </div>
          </div>

          <ChevronRight size={20} />
        </Link>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, description, danger, success }) {
  return (
    <div className="stat-card">
      <div
        className={`stat-icon ${
          danger ? "danger" : ""
        } ${success ? "success" : ""}`}
      >
        {icon}
      </div>

      <span className="stat-label">{label}</span>

      <strong className="stat-value">{value}</strong>

      <small className="stat-description">{description}</small>
    </div>
  );
}

function PanelHeader({ eyebrow, title, icon }) {
  return (
    <div className="panel-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>

      <span className="panel-header-icon">{icon}</span>
    </div>
  );
}

function FlaskIcon() {
  return <span className="simple-icon">⚗</span>;
}

export default Overview;
