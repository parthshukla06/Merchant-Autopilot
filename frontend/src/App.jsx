import { useEffect, useState } from "react";
import AnalyticsCharts from "./components/AnalyticsCharts";
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
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import "./App.css";

const API_URL = "https://merchant-autopilot.onrender.com";
const MERCHANT_ID = "6a89dccdcc29ecf53a7612f3";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [whatIfLoading, setWhatIfLoading] = useState(false);
  const [whatIfResult, setWhatIfResult] = useState(null);

  // What-if controls
  const [discountPercent, setDiscountPercent] = useState(10);
  const [salesChangePercent, setSalesChangePercent] = useState(15);
  const [rtoChangePercent, setRtoChangePercent] = useState(-20);
  const [refundChangePercent, setRefundChangePercent] = useState(-15);
  const [paymentFailureChangePercent, setPaymentFailureChangePercent] =
    useState(-10);
  const [chargebackChangePercent, setChargebackChangePercent] = useState(-10);

  const [mlRisk, setMlRisk] = useState(null);
  useEffect(() => {
    console.log("ML RISK STATE:", mlRisk);
  }, [mlRisk]);

  // Dark / Light mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("merchant-autopilot-theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem(
      "merchant-autopilot-theme",
      darkMode ? "dark" : "light",
    );

    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  // --------------------------------------------------
  // FETCH MERCHANT INTELLIGENCE
  // --------------------------------------------------

  const fetchIntelligence = async () => {
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
      console.error(err);
      setError("Unable to connect to Merchant Autopilot backend.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // RUN WHAT-IF SCENARIO
  // --------------------------------------------------

  const runWhatIf = async () => {
    try {
      setWhatIfLoading(true);

      const response = await axios.post(
        `${API_URL}/api/merchants/${MERCHANT_ID}/what-if`,
        {
          discountPercent: Number(discountPercent),
          salesChangePercent: Number(salesChangePercent),
          rtoChangePercent: Number(rtoChangePercent),
          refundChangePercent: Number(refundChangePercent),
          paymentFailureChangePercent: Number(paymentFailureChangePercent),
          chargebackChangePercent: Number(chargebackChangePercent),
        },
      );

      console.log("WHAT-IF RESPONSE:", response.data.data);

      setWhatIfResult(response.data.data);
    } catch (err) {
      console.error(
        "WHAT-IF ERROR:",
        err.response?.data || err.message,
      );
      alert(err.response?.data?.message || err.message);
    } finally {
      setWhatIfLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, []);

  // --------------------------------------------------
  // LOADING SCREEN
  // --------------------------------------------------

  if (loading) {
    return (
      <div className={`app loading-screen ${darkMode ? "dark" : ""}`}>
        <RefreshCw className="loading-icon" size={28} />
        <h2>Loading Merchant Intelligence...</h2>
        <p>Analyzing business performance</p>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR SCREEN
  // --------------------------------------------------

  if (error) {
    return (
      <div className={`app loading-screen ${darkMode ? "dark" : ""}`}>
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
    <div className={darkMode ? "app dark" : "app"}>
      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="topbar">
        <div>
          <div className="brand">
            <ShieldAlert size={25} />
            <span>Merchant Autopilot</span>
          </div>

          <p className="subtitle">AI-powered merchant intelligence</p>
        </div>

        <div className="topbar-actions">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((prev) => !prev)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            {darkMode ? "Light" : "Dark"}
          </button>

          <button className="refresh-button" onClick={fetchIntelligence}>
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>
      </header>

      <main className="dashboard">
        {/* ==================================================
            BUSINESS OVERVIEW
        ================================================== */}

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

        {/* ==================================================
            METRICS
        ================================================== */}

        <section className="metrics-grid">
          <MetricCard
            icon={<CircleDollarSign />}
            label="Total Financial Exposure"
            value={`₹${financialOverview.totalFinancialExposure.toLocaleString(
              "en-IN",
            )}`}
            description="Identified exposure"
            type="risk"
          />

          <MetricCard
            icon={<Wallet />}
            label="Money At Risk"
            value={`₹${financialOverview.confirmedMoneyAtRisk.toLocaleString(
              "en-IN",
            )}`}
            description="Confirmed financial risk"
            type="risk"
          />

          <MetricCard
            icon={<TrendingUp />}
            label="Recoverable Opportunity"
            value={`₹${financialOverview.recoverableOpportunity.toLocaleString(
              "en-IN",
            )}`}
            description="Potential recovery"
            type="success"
          />

          <MetricCard
            icon={<ArrowUpRight />}
            label="Business Priority"
            value={overallPriority.toUpperCase()}
            description="Current intelligence level"
            type="default"
          />

          <div
            className={`metric-card ml-risk-card ${
              mlRisk?.prediction?.risk || ""
            }`}
          >
            <div className="metric-icon">
              <ShieldAlert />
            </div>

            <p>ML Risk Prediction</p>

            <h2>{mlRisk?.prediction?.risk?.toUpperCase() || "N/A"}</h2>

            <span>
              {mlRisk?.prediction?.riskProbability !== undefined
                ? `${Math.round(
                    mlRisk.prediction.riskProbability * 100,
                  )}% confidence`
                : "Analyzing..."}
            </span>
          </div>
        </section>

        {/* ==================================================
    ISSUES + INSIGHT
================================================== */}
        {/* ==================================================
            ISSUES + INSIGHT
        ================================================== */}

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

        {/* ==================================================
            RECOMMENDATIONS
        ================================================== */}

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

        {/* ==================================================
            WHAT-IF SIMULATOR
        ================================================== */}

        <section className="panel what-if-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">WHAT-IF SIMULATOR</p>

              <h2>Test Business Decisions</h2>

              <p className="panel-description">
                Simulate pricing and operational changes before taking action.
              </p>
            </div>

            <TrendingUp size={22} />
          </div>

          {/* INPUTS */}

          <div className="what-if-controls">
            <ScenarioInput
              label="Discount"
              value={discountPercent}
              onChange={setDiscountPercent}
              min="0"
              max="100"
            />

            <ScenarioInput
              label="Expected Sales Change"
              value={salesChangePercent}
              onChange={setSalesChangePercent}
              min="-100"
            />

            <ScenarioInput
              label="RTO Change"
              value={rtoChangePercent}
              onChange={setRtoChangePercent}
              min="-100"
            />

            <ScenarioInput
              label="Refund Change"
              value={refundChangePercent}
              onChange={setRefundChangePercent}
              min="-100"
            />

            <ScenarioInput
              label="Payment Failure Change"
              value={paymentFailureChangePercent}
              onChange={setPaymentFailureChangePercent}
              min="-100"
            />

            <ScenarioInput
              label="Chargeback Change"
              value={chargebackChangePercent}
              onChange={setChargebackChangePercent}
              min="-100"
            />

            <button
              className="simulate-button"
              onClick={runWhatIf}
              disabled={whatIfLoading}
            >
              {whatIfLoading ? "Analyzing..." : "Run Scenario"}
            </button>
          </div>

          {/* ==================================================
              WHAT-IF RESULT
================================================== */}
          {whatIfResult && (
            <>
              <div className="scenario-risk">
                <strong>Scenario Risk</strong>
                <h3>
                  {whatIfResult.scenarioRisk?.level?.toUpperCase() || "N/A"}
                </h3>
                <span>Score: {whatIfResult.scenarioRisk?.score ?? "N/A"}</span>
              </div>

              <div className="what-if-results">
                <div className="scenario-summary">
                  <strong>Scenario Result</strong>

                  <span>
                    {whatIfResult.scenario.discountPercent}% discount ·{" "}
                    {whatIfResult.scenario.salesChangePercent}% sales ·{" "}
                    {whatIfResult.scenario.rtoChangePercent}% RTO ·{" "}
                    {whatIfResult.scenario.refundChangePercent}% refunds
                  </span>
                </div>

                {/* RESULT CARDS */}

                <div className="scenario-grid">
                  <ScenarioCard
                    label="Revenue Change"
                    value={whatIfResult.result.impact.revenueChange}
                  />

                  <ScenarioCard
                    label="Profit Change"
                    value={whatIfResult.result.impact.profitChange}
                  />

                  <ScenarioCard
                    label="Additional Orders"
                    value={whatIfResult.result.impact.additionalOrders}
                    plain
                  />

                  <ScenarioCard
                    label="Discount Cost"
                    value={whatIfResult.result.impact.discountCost}
                  />

                  <ScenarioCard
                    label="Estimated Recovery"
                    value={whatIfResult.result.impact.estimatedRecovery}
                  />

                  <ScenarioCard
                    label="RTO Recovery"
                    value={whatIfResult.result.impact.rtoRecovery}
                  />

                  <ScenarioCard
                    label="Refund Recovery"
                    value={whatIfResult.result.impact.refundRecovery}
                  />

                  <ScenarioCard
                    label="Payment Recovery"
                    value={whatIfResult.result.impact.paymentRecovery}
                  />

                  <ScenarioCard
                    label="Chargeback Recovery"
                    value={whatIfResult.result.impact.chargebackRecovery}
                  />
                </div>

                {/* RECOMMENDATION */}

                <div
                  className={`scenario-recommendation ${
                    whatIfResult.result.impact.recommendation === "RECOMMENDED"
                      ? "recommended"
                      : whatIfResult.result.impact.recommendation === "NEUTRAL"
                        ? "neutral"
                        : "not-recommended"
                  }`}
                >
                  <strong>{whatIfResult.result.impact.recommendation}</strong>

                  <span>Scenario analyzed using current business metrics.</span>
                </div>

                {/* ==================================================
                  AI BUSINESS ADVISOR
              ================================================== */}

                {whatIfResult.advice?.advice && (
                  <div className="ai-advisor-card">
                    <div className="ai-advisor-header">
                      <div className="ai-advisor-title">
                        <div className="ai-advisor-icon">
                          <Sparkles size={22} />
                        </div>

                        <div>
                          <p className="eyebrow">AI BUSINESS ADVISOR</p>

                          <h2>AI-Powered Decision Analysis</h2>
                        </div>
                      </div>

                      <span className="ai-badge">
                        {whatIfResult.advice.aiGenerated
                          ? "AI GENERATED"
                          : "RULE BASED"}
                      </span>
                    </div>

                    <div className="ai-advisor-content">
                      {whatIfResult.advice.advice
                        .split("\n")
                        .map((line, index) => {
                          const trimmedLine = line.trim();

                          if (!trimmedLine) {
                            return <div key={index} className="ai-space" />;
                          }

                          if (trimmedLine.startsWith("**SUMMARY:**")) {
                            return <h3 key={index}>Summary</h3>;
                          }

                          if (trimmedLine.startsWith("**FINANCIAL IMPACT:**")) {
                            return <h3 key={index}>Financial Impact</h3>;
                          }

                          if (trimmedLine.startsWith("**RECOMMENDATION:**")) {
                            return <h3 key={index}>Recommendation</h3>;
                          }

                          if (trimmedLine.startsWith("**EXPLANATION:**")) {
                            return <h3 key={index}>Explanation</h3>;
                          }

                          if (trimmedLine.startsWith("**NEXT STEP:**")) {
                            return <h3 key={index}>Next Step</h3>;
                          }

                          return (
                            <p key={index}>
                              {trimmedLine
                                .replace(/^\*\s*/, "• ")
                                .replace(/^\d+\.\s*/, (match) => match)}
                            </p>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {/* ==================================================
            ANALYTICS CHARTS
        ================================================== */}

        {whatIfResult && (
          <AnalyticsCharts
            dashboardData={whatIfResult.result.current}
            whatIfResult={whatIfResult.result}
          />
        )}
      </main>
    </div>
  );
}

// ==================================================
// SCENARIO INPUT
// ==================================================

function ScenarioInput({ label, value, onChange, min, max }) {
  return (
    <div className="input-group">
      <label>{label} (%)</label>

      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ==================================================
// SCENARIO CARD
// ==================================================

function ScenarioCard({ label, value, plain = false }) {
  return (
    <div className="scenario-card">
      <span>{label}</span>

      <strong>
        {plain
          ? Number(value).toLocaleString("en-IN")
          : `₹${Number(value).toLocaleString("en-IN")}`}
      </strong>
    </div>
  );
}

// ==================================================
// METRIC CARD
// ==================================================

function MetricCard({ icon, label, value, description, type = "default" }) {
  return (
    <div className={`metric-card ${type}`}>
      <div className="metric-top">
        <div className="metric-icon">{icon}</div>

        {type === "risk" && <span className="metric-status danger">Risk</span>}

        {type === "success" && (
          <span className="metric-status success">Opportunity</span>
        )}
      </div>

      <p className="metric-label">{label}</p>

      <h2 className="metric-value">{value}</h2>

      <span className="metric-description">{description}</span>
    </div>
  );
}

// ==================================================
// ISSUE
// ==================================================

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
