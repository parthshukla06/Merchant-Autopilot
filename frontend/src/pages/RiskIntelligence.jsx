import { useEffect, useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  ShieldAlert,
  RefreshCw,
  TrendingUp,
  Activity,
  CheckCircle2,
} from "lucide-react";

const API_URL = "https://merchant-autopilot.onrender.com";
const MERCHANT_ID = "6a89dccdcc29ecf53a7612f3";

function RiskIntelligence() {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRisk = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/api/merchants/${MERCHANT_ID}/ml-risk`,
      );

      setRisk(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisk();
  }, []);

  if (loading) {
    return (
      <div className="page-state">
        <RefreshCw className="spin" size={28} />
        <h2>Analyzing risk...</h2>
        <p>Evaluating current merchant transaction behaviour.</p>
      </div>
    );
  }

  const prediction = risk?.prediction;
  const score = Number(risk?.score ?? 0);
  const probability = Number(prediction?.riskProbability ?? 0);

  const riskLevel = (prediction?.risk || "N/A").toLowerCase();

  const riskClass = ["low", "medium", "high", "critical"].includes(riskLevel)
    ? riskLevel
    : "medium";

  const reasons = risk?.reasons || [];
  const features = risk?.features || {};

  const paymentFailure = Number(features.payment_failure_rate || 0);
  const rtoRate = Number(features.rto_rate || 0);
  const chargebackRate = Number(features.chargeback_rate || 0);
  const refundRate = Number(features.refund_rate || 0);

  const paymentSuccess = Math.max(0, 100 - paymentFailure);

  return (
    <div className="page">
      {/* HEADER */}
      <header className="page-header">
        <div>
          <p className={`eyebrow risk-eyebrow ${riskClass}`}>
            RISK MANAGEMENT
          </p>

          <h1>Risk Intelligence</h1>

          <p className="page-subtitle">
            Understand what is driving merchant risk and where attention is
            needed.
          </p>
        </div>

        <button
          className="refresh-button risk-refresh"
          onClick={fetchRisk}
          title="Refresh risk intelligence"
          disabled={loading}
        >
          <RefreshCw size={17} className={loading ? "spin" : ""} />
          <span>Refresh</span>
        </button>
      </header>

      {/* RISK OVERVIEW */}
      <section className={`risk-hero ${riskClass}`}>
        <div className="risk-hero-left">
          <div className="risk-gauge">
            <div
              className="risk-gauge-progress"
              style={{
                "--risk-score": `${score * 3.6}deg`,
              }}
            >
              <div className="gauge-inner">
                <span>RISK SCORE</span>
                <strong>{score}</strong>
                <small>/100</small>
              </div>
            </div>
          </div>

          <div className="risk-score-caption">
            <strong>Current merchant risk</strong>
            <span>assessment</span>
          </div>
        </div>

        <div className="risk-hero-divider" />

        <div className="risk-hero-content">
          <p className="eyebrow">CURRENT PREDICTION</p>

          <div className="risk-prediction">
            <span className="risk-prediction-icon">
              <ShieldAlert size={25} />
            </span>

            <h2>{riskLevel.toUpperCase()}</h2>
          </div>

          <p className="risk-confidence">
            <strong>{Math.round(probability * 100)}% confidence</strong>
            <span>based on current transaction behaviour.</span>
          </p>

          <div className="risk-progress-wrapper">
            <div className="risk-progress">
              <span style={{ width: `${Math.min(score, 100)}%` }}>
                {score}%
              </span>
            </div>
          </div>
        </div>

        <div className="risk-decoration">
          <ShieldAlert size={130} strokeWidth={1} />
        </div>
      </section>

      {/* RISK DRIVERS */}
      <section className="risk-drivers-section">
        <div className="section-heading">
          <div>
            <p className={`eyebrow risk-eyebrow ${riskClass}`}>
              RISK DRIVERS
            </p>

            <h2>Why is risk elevated?</h2>
          </div>

          <div className="section-icon">
            <ShieldAlert size={19} />
          </div>
        </div>

        <div className="risk-driver-grid">
          {reasons.map((reason, index) => (
            <div className="risk-driver-card" key={index}>
              <div className="driver-icon">
                <AlertTriangle size={18} />
              </div>

              <div className="driver-content">
                <span className="driver-badge">RISK SIGNAL</span>

                <h3>{reason}</h3>

                <strong>Detected from current merchant behaviour</strong>

                <p>
                  This signal is contributing to the current merchant risk
                  assessment.
                </p>
              </div>
            </div>
          ))}

          {!reasons.length && (
            <div className="risk-no-issues">
              <CheckCircle2 size={24} />
              <div>
                <strong>No major risk drivers detected</strong>
                <span>
                  Current transaction behaviour is within acceptable levels.
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* OPERATIONAL METRICS */}
      <section className="risk-metrics-section">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">OPERATIONAL METRICS</p>
            <h2>Current risk indicators</h2>
          </div>

          <Activity size={20} />
        </div>

        <div className="feature-grid risk-metrics-grid">
          <RiskMetric
            icon={<TrendingUp />}
            label="Payment Success"
            value={`${paymentSuccess.toFixed(1)}%`}
            type="success"
          />

          <RiskMetric
            icon={<AlertTriangle />}
            label="RTO Rate"
            value={`${rtoRate.toFixed(1)}%`}
            type={rtoRate >= 10 ? "danger" : "warning"}
          />

          <RiskMetric
            icon={<ShieldAlert />}
            label="Chargeback Rate"
            value={`${chargebackRate.toFixed(1)}%`}
            type={chargebackRate >= 3 ? "danger" : "warning"}
          />

          <RiskMetric
            icon={<TrendingUp />}
            label="Refund Rate"
            value={`${refundRate.toFixed(1)}%`}
            type={refundRate >= 7 ? "danger" : "warning"}
          />
        </div>
      </section>
    </div>
  );
}

function RiskMetric({ icon, label, value, type }) {
  return (
    <div className={`mini-card risk-metric-card ${type}`}>
      <div className="metric-icon">{icon}</div>

      <div className="metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default RiskIntelligence;