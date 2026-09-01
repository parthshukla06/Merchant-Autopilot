import { useState } from "react";
import axios from "axios";
import {
  FlaskConical,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ShieldAlert,
  Wallet,
} from "lucide-react";

const API_URL = "https://merchant-autopilot.onrender.com";
const MERCHANT_ID = "6a89dccdcc29ecf53a7612f3";

const DEFAULT_VALUES = {
  discountPercent: 10,
  salesChangePercent: 15,
  rtoChangePercent: -20,
  refundChangePercent: -15,
  paymentFailureChangePercent: -10,
  chargebackChangePercent: -10,
};

const SCENARIO_FIELDS = [
  {
    key: "discountPercent",
    label: "Discount",
    description: "Promotion discount",
    min: 0,
    max: 50,
    color: "purple",
  },
  {
    key: "salesChangePercent",
    label: "Sales Change",
    description: "Expected sales growth",
    min: -100,
    max: 100,
    color: "blue",
  },
  {
    key: "rtoChangePercent",
    label: "RTO Change",
    description: "Return-to-origin change",
    min: -100,
    max: 100,
    color: "orange",
  },
  {
    key: "refundChangePercent",
    label: "Refund Change",
    description: "Refund rate change",
    min: -100,
    max: 100,
    color: "green",
  },
  {
    key: "paymentFailureChangePercent",
    label: "Payment Failure",
    description: "Failure rate change",
    min: -100,
    max: 100,
    color: "red",
  },
  {
    key: "chargebackChangePercent",
    label: "Chargeback Change",
    description: "Chargeback rate change",
    min: -100,
    max: 100,
    color: "purple",
  },
];

function WhatIfSimulator() {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const resetScenario = () => {
    setValues({ ...DEFAULT_VALUES });
    setResult(null);
  };

  const runScenario = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/merchants/${MERCHANT_ID}/what-if`,
        values,
      );

      setResult(response.data.data);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to analyze scenario.",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    if (value === undefined || value === null) return "—";

    return `₹${Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatRate = (value) => {
    if (value === undefined || value === null) return "—";

    return `${Number(value).toFixed(2)}%`;
  };

  const impact = result?.result?.impact;
  const current = result?.result?.current;
  const scenario = result?.result?.scenario;
  const scenarioRisk = result?.scenarioRisk;
  const advice = result?.advice;

  const adviceSections = parseAdvice(advice?.advice);

  return (
    <div className="page what-if-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="page-header what-if-page-header">
        <div>
          <p className="eyebrow">SIMULATION</p>

          <h1>What-If Simulator</h1>

          <p className="page-subtitle">
            Simulate business changes and evaluate their potential
            financial and operational impact.
          </p>
        </div>

        <button
          type="button"
          className="what-if-reset-button"
          onClick={resetScenario}
          disabled={loading}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </header>

      {/* =====================================================
          SCENARIO INPUTS
          ===================================================== */}

      <section className="what-if-input-panel">

        <div className="what-if-section-header">
          <div className="what-if-section-title">
            <div className="what-if-header-icon">
              <FlaskConical size={20} />
            </div>

            <div>
              <h2>Scenario Inputs</h2>

              <p>
                Adjust business parameters and run a scenario.
              </p>
            </div>
          </div>

          <div className="simulation-engine-badge">
            <Sparkles size={14} />
            Simulation Engine
          </div>
        </div>

        <div className="what-if-field-grid">
          {SCENARIO_FIELDS.map((field) => (
            <ScenarioField
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={(value) =>
                update(field.key, value)
              }
            />
          ))}
        </div>

        <div className="what-if-input-footer">
          <p>
            Set your scenario inputs, then run the simulation to
            see the projected business impact.
          </p>

          <button
            type="button"
            className="what-if-run-button"
            onClick={runScenario}
            disabled={loading}
          >
            <FlaskConical size={16} />

            {loading
              ? "Analyzing..."
              : "Run Scenario"}
          </button>
        </div>
      </section>

      {/* =====================================================
          RESULTS
          ===================================================== */}

      {result && (
        <section className="what-if-results">

          <div className="what-if-results-header">
            <div>
              <p className="eyebrow">SCENARIO RESULT</p>

              <h2>Simulation Results</h2>

              <p>
                Based on the business changes you submitted.
              </p>
            </div>

            <div
              className={`what-if-recommendation ${
                impact?.recommendation === "NOT RECOMMENDED"
                  ? "not-recommended"
                  : "recommended"
              }`}
            >
              {impact?.recommendation === "NOT RECOMMENDED" ? (
                <AlertTriangle size={15} />
              ) : (
                <CheckCircle2 size={15} />
              )}

              {impact?.recommendation ||
                "SCENARIO ANALYZED"}
            </div>
          </div>

          {/* =================================================
              TOP METRICS
              ================================================= */}

          <div className="what-if-result-metrics">

            <ResultMetric
              label="Current Revenue"
              value={formatMoney(current?.revenue)}
            />

            <ResultMetric
              label="Scenario Revenue"
              value={formatMoney(scenario?.revenue)}
              change={impact?.revenueChange}
            />

            <ResultMetric
              label="Current Profit"
              value={formatMoney(current?.profit)}
            />

            <ResultMetric
              label="Scenario Profit"
              value={formatMoney(scenario?.profit)}
              change={impact?.profitChange}
              negative={Number(impact?.profitChange) < 0}
            />

            <ResultMetric
              label="Current Orders"
              value={current?.orders ?? "—"}
            />

            <ResultMetric
              label="Scenario Orders"
              value={scenario?.orders ?? "—"}
              change={impact?.additionalOrders}
              suffix=" orders"
            />

          </div>

          {/* =================================================
              RISK + FINANCIAL IMPACT
              ================================================= */}

          <div className="what-if-two-column">

            {/* RISK */}

            <div className="what-if-result-card">

              <div className="what-if-card-heading">
                <div>
                  <h3>Operational Risk</h3>
                  <p>Scenario risk assessment</p>
                </div>

                <ShieldAlert size={19} />
              </div>

              <div className="what-if-risk-main">

                <div>
                  <span>Scenario Risk Score</span>

                  <strong>
                    {scenarioRisk?.score ?? "—"}
                    <small>/100</small>
                  </strong>
                </div>

                <span className="what-if-risk-level">
                  {scenarioRisk?.level?.toUpperCase() ||
                    "N/A"}
                </span>

              </div>

              {scenarioRisk?.reasons?.length > 0 && (
                <div className="what-if-risk-reasons">
                  {scenarioRisk.reasons.map(
                    (reason, index) => (
                      <span key={index}>
                        <AlertTriangle size={11} />
                        {reason}
                      </span>
                    ),
                  )}
                </div>
              )}

            </div>

            {/* FINANCIAL */}

            <div className="what-if-result-card">

              <div className="what-if-card-heading">
                <div>
                  <h3>Financial Impact</h3>
                  <p>Projected scenario economics</p>
                </div>

                <Wallet size={19} />
              </div>

              <div className="what-if-financial-grid">

                <FinancialMetric
                  label="Discount Cost"
                  value={formatMoney(
                    impact?.discountCost,
                  )}
                />

                <FinancialMetric
                  label="Estimated Recovery"
                  value={formatMoney(
                    impact?.estimatedRecovery,
                  )}
                  positive
                />

                <FinancialMetric
                  label="RTO Recovery"
                  value={formatMoney(
                    impact?.rtoRecovery,
                  )}
                />

                <FinancialMetric
                  label="Refund Recovery"
                  value={formatMoney(
                    impact?.refundRecovery,
                  )}
                />

                <FinancialMetric
                  label="Payment Recovery"
                  value={formatMoney(
                    impact?.paymentRecovery,
                  )}
                />

                <FinancialMetric
                  label="Chargeback Recovery"
                  value={formatMoney(
                    impact?.chargebackRecovery,
                  )}
                />

              </div>
            </div>

          </div>

          {/* =================================================
              OPERATIONAL COMPARISON
              ================================================= */}

          <div className="what-if-comparison-card">

            <div className="what-if-card-heading">
              <div>
                <h3>Operational Rate Comparison</h3>

                <p>
                  Current versus simulated business conditions
                </p>
              </div>

              <FlaskConical size={19} />
            </div>

            <div className="what-if-comparison">

              <ComparisonRow
                label="RTO Rate"
                current={current?.rtoRate}
                scenario={scenario?.rtoRate}
              />

              <ComparisonRow
                label="Refund Rate"
                current={current?.refundRate}
                scenario={scenario?.refundRate}
              />

              <ComparisonRow
                label="Payment Failure"
                current={current?.paymentFailureRate}
                scenario={scenario?.paymentFailureRate}
              />

              <ComparisonRow
                label="Chargeback Rate"
                current={current?.chargebackRate}
                scenario={scenario?.chargebackRate}
              />

            </div>

            <div className="what-if-comparison-legend">
              <span>
                <i className="current-dot" />
                Current
              </span>

              <span>
                <i className="scenario-dot" />
                Scenario
              </span>
            </div>

          </div>

          {/* =================================================
              AI ADVISOR
              ================================================= */}

          {advice?.advice && (
            <div className="what-if-ai-card">

              <div className="what-if-ai-header">

                <div className="what-if-ai-title">
                  <div className="what-if-ai-icon">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <h3>AI Business Advisor</h3>

                    <p>
                      Decision-oriented guidance for this scenario.
                    </p>
                  </div>
                </div>

                <span className="what-if-ai-badge">
                  <Sparkles size={11} />
                  {advice.aiGenerated
                    ? "AI GENERATED"
                    : "RULE BASED"}
                </span>

              </div>

              <div className="what-if-ai-grid">
                {adviceSections.map((section, index) => (
                  <div
                    className="what-if-ai-section"
                    key={index}
                  >
                    <h4>{section.title}</h4>

                    <p>{section.content}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* =================================================
              MODIFY
              ================================================= */}

          <div className="what-if-modify">
            <button
              type="button"
              className="what-if-modify-button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
            >
              <FlaskConical size={15} />
              Modify Scenario
            </button>
          </div>

        </section>
      )}
    </div>
  );
}

/* =========================================================
   SCENARIO FIELD
   ========================================================= */

function ScenarioField({
  field,
  value,
  onChange,
}) {
  const {
    key,
    label,
    description,
    min,
    max,
    color,
  } = field;

  return (
    <div
      className={`what-if-field what-if-${color}`}
    >
      <div className="what-if-field-top">

        <div className="what-if-field-title">
          <strong>{label}</strong>
          <span>{description}</span>
        </div>

        <div className="what-if-number-input">
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(event) =>
              onChange(event.target.value)
            }
          />

          <span>%</span>
        </div>

      </div>

      <input
        className="what-if-range"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

      <div className="what-if-range-labels">
        <span>{min}%</span>
        <span>
          {max > 0 ? `+${max}%` : `${max}%`}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   RESULT METRIC
   ========================================================= */

function ResultMetric({
  label,
  value,
  change,
  negative = false,
  suffix = "",
}) {
  const hasChange =
    change !== undefined &&
    change !== null &&
    Number(change) !== 0;

  return (
    <div className="what-if-metric">

      <span>{label}</span>

      <strong>{value}</strong>

      {hasChange && (
        <small
          className={
            negative ? "negative" : "positive"
          }
        >
          {Number(change) < 0 ? (
            <TrendingDown size={12} />
          ) : (
            <TrendingUp size={12} />
          )}

          {Number(change) > 0 ? "+" : ""}
          {Number(change).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
          {suffix}
        </small>
      )}

    </div>
  );
}

/* =========================================================
   FINANCIAL METRIC
   ========================================================= */

function FinancialMetric({
  label,
  value,
  positive = false,
}) {
  return (
    <div className="what-if-financial-metric">
      <span>{label}</span>

      <strong className={positive ? "positive" : ""}>
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   COMPARISON ROW
   ========================================================= */

function ComparisonRow({
  label,
  current,
  scenario,
}) {
  const currentValue =
    current === undefined || current === null
      ? null
      : Number(current);

  const scenarioValue =
    scenario === undefined || scenario === null
      ? null
      : Number(scenario);

  const difference =
    currentValue !== null &&
    scenarioValue !== null
      ? scenarioValue - currentValue
      : null;

  return (
    <div className="what-if-comparison-row">

      <span>{label}</span>

      <strong>
        {currentValue === null
          ? "—"
          : `${currentValue.toFixed(2)}%`}
      </strong>

      <strong className="scenario-value">
        {scenarioValue === null
          ? "—"
          : `${scenarioValue.toFixed(2)}%`}
      </strong>

      <strong
        className={
          difference === null
            ? ""
            : difference < 0
              ? "positive"
              : difference > 0
                ? "negative"
                : ""
        }
      >
        {difference === null
          ? "—"
          : `${difference > 0 ? "+" : ""}${difference.toFixed(
              2,
            )}%`}
      </strong>

    </div>
  );
}

/* =========================================================
   AI ADVICE PARSER
   ========================================================= */

function parseAdvice(text) {
  if (!text) return [];

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = [];
  let currentSection = null;

  const headingMap = {
    SUMMARY: "Summary",
    "FINANCIAL IMPACT": "Financial Impact",
    RECOMMENDATION: "Recommendation",
    EXPLANATION: "Explanation",
    "NEXT STEP": "Next Step",
  };

  lines.forEach((line) => {
    const clean = line
      .replace(/\*\*/g, "")
      .replace(/:$/, "")
      .trim();

    const upper = clean.toUpperCase();

    if (headingMap[upper]) {
      if (currentSection) {
        sections.push(currentSection);
      }

      currentSection = {
        title: headingMap[upper],
        content: "",
      };

      return;
    }

    if (!currentSection) {
      currentSection = {
        title: "Summary",
        content: "",
      };
    }

    currentSection.content +=
      `${currentSection.content ? " " : ""}${clean}`;
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

export default WhatIfSimulator;