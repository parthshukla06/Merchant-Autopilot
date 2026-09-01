import { useState } from "react";
import axios from "axios";
import {
  FlaskConical,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  RefreshCw,
  IndianRupee,
  ShieldAlert,
  WalletCards,
  Package,
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

function WhatIfSimulator() {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateValue = (key, value) => {
    setValues((current) => ({
      ...current,
      [key]: Number(value),
    }));
  };

  const runScenario = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/api/merchants/${MERCHANT_ID}/what-if`,
        values,
      );

      setResult(response.data?.data || null);
    } catch (err) {
      console.error("What-if error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to run this scenario. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScenario = () => {
    setValues(DEFAULT_VALUES);
    setResult(null);
    setError("");
  };

  const formatMoney = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const formatPercent = (value) =>
    `${Number(value || 0).toFixed(2)}%`;

  const getChangeClass = (value) => {
    if (Number(value) > 0) return "positive";
    if (Number(value) < 0) return "negative";
    return "neutral";
  };

  const renderChange = (value) => {
    const number = Number(value || 0);

    if (number > 0) {
      return (
        <span className="whatif-change positive">
          <TrendingUp size={14} />
          +{formatMoney(number)}
        </span>
      );
    }

    if (number < 0) {
      return (
        <span className="whatif-change negative">
          <TrendingDown size={14} />
          {formatMoney(number)}
        </span>
      );
    }

    return (
      <span className="whatif-change neutral">
        — ₹0
      </span>
    );
  };

  const scenario = result?.scenario;
  const current = result?.result?.current;
  const scenarioResult = result?.result?.scenario;
  const impact = result?.result?.impact;
  const scenarioRisk = result?.scenarioRisk;
  const advice = result?.advice;

  const riskClass =
    scenarioRisk?.level === "safe"
      ? "safe"
      : scenarioRisk?.level === "warning"
        ? "warning"
        : "danger";

  return (
    <div className="page whatif-page">
      {/* HEADER */}
      <header className="page-header whatif-header">
        <div>
          <p className="eyebrow">SIMULATION</p>

          <h1>What-If Simulator</h1>

          <p className="page-subtitle">
            Simulate business changes and evaluate their potential financial
            and operational impact.
          </p>
        </div>

        <button
          className="whatif-reset-button"
          onClick={resetScenario}
          disabled={loading}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </header>

      {/* SCENARIO INPUT */}
      <section className="whatif-input-panel">
        <div className="whatif-section-header">
          <div>
            <div className="whatif-section-title">
              <div className="whatif-title-icon purple">
                <FlaskConical size={19} />
              </div>

              <div>
                <h2>Scenario Inputs</h2>
                <p>
                  Adjust business parameters and run a scenario.
                </p>
              </div>
            </div>
          </div>

          <span className="scenario-badge">
            <Sparkles size={13} />
            Simulation Engine
          </span>
        </div>

        <div className="whatif-input-grid">
          {/* DISCOUNT */}
          <div className="whatif-input-card purple">
            <div className="whatif-input-top">
              <div className="whatif-input-icon">
                <IndianRupee size={18} />
              </div>

              <div>
                <strong>Discount</strong>
                <span>Promotion discount</span>
              </div>

              <div className="whatif-number-input">
                <input
                  type="number"
                  value={values.discountPercent}
                  min="0"
                  max="100"
                  onChange={(e) =>
                    updateValue(
                      "discountPercent",
                      e.target.value,
                    )
                  }
                />
                <span>%</span>
              </div>
            </div>

            <input
              className="whatif-slider"
              type="range"
              min="0"
              max="50"
              step="1"
              value={values.discountPercent}
              onChange={(e) =>
                updateValue(
                  "discountPercent",
                  e.target.value,
                )
              }
            />

            <div className="slider-labels">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>

          {/* SALES */}
          <div className="whatif-input-card blue">
            <div className="whatif-input-top">
              <div className="whatif-input-icon">
                <TrendingUp size={18} />
              </div>

              <div>
                <strong>Sales Change</strong>
                <span>Expected sales growth</span>
              </div>

              <div className="whatif-number-input">
                <input
                  type="number"
                  value={values.salesChangePercent}
                  min="-100"
                  max="100"
                  onChange={(e) =>
                    updateValue(
                      "salesChangePercent",
                      e.target.value,
                    )
                  }
                />
                <span>%</span>
              </div>
            </div>

            <input
              className="whatif-slider"
              type="range"
              min="-100"
              max="100"
              step="5"
              value={values.salesChangePercent}
              onChange={(e) =>
                updateValue(
                  "salesChangePercent",
                  e.target.value,
                )
              }
            />

            <div className="slider-labels">
              <span>-100%</span>
              <span>+100%</span>
            </div>
          </div>

          {/* RTO */}
          <div className="whatif-input-card orange">
            <div className="whatif-input-top">
              <div className="whatif-input-icon">
                <RotateCcw size={18} />
              </div>

              <div>
                <strong>RTO Change</strong>
                <span>Return-to-origin change</span>
              </div>

              <div className="whatif-number-input">
                <input
                  type="number"
                  value={values.rtoChangePercent}
                  min="-100"
                  max="100"
                  onChange={(e) =>
                    updateValue(
                      "rtoChangePercent",
                      e.target.value,
                    )
                  }
                />
                <span>%</span>
              </div>
            </div>

            <input
              className="whatif-slider"
              type="range"
              min="-100"
              max="100"
              step="5"
              value={values.rtoChangePercent}
              onChange={(e) =>
                updateValue(
                  "rtoChangePercent",
                  e.target.value,
                )
              }
            />

            <div className="slider-labels">
              <span>-100%</span>
              <span>+100%</span>
            </div>
          </div>

          {/* REFUND */}
          <div className="whatif-input-card green">
            <div className="whatif-input-top">
              <div className="whatif-input-icon">
                <WalletCards size={18} />
              </div>

              <div>
                <strong>Refund Change</strong>
                <span>Refund rate change</span>
              </div>

              <div className="whatif-number-input">
                <input
                  type="number"
                  value={values.refundChangePercent}
                  min="-100"
                  max="100"
                  onChange={(e) =>
                    updateValue(
                      "refundChangePercent",
                      e.target.value,
                    )
                  }
                />
                <span>%</span>
              </div>
            </div>

            <input
              className="whatif-slider"
              type="range"
              min="-100"
              max="100"
              step="5"
              value={values.refundChangePercent}
              onChange={(e) =>
                updateValue(
                  "refundChangePercent",
                  e.target.value,
                )
              }
            />

            <div className="slider-labels">
              <span>-100%</span>
              <span>+100%</span>
            </div>
          </div>

          {/* PAYMENT FAILURE */}
          <div className="whatif-input-card red">
            <div className="whatif-input-top">
              <div className="whatif-input-icon">
                <AlertTriangle size={18} />
              </div>

              <div>
                <strong>Payment Failure</strong>
                <span>Failure rate change</span>
              </div>

              <div className="whatif-number-input">
                <input
                  type="number"
                  value={values.paymentFailureChangePercent}
                  min="-100"
                  max="100"
                  onChange={(e) =>
                    updateValue(
                      "paymentFailureChangePercent",
                      e.target.value,
                    )
                  }
                />
                <span>%</span>
              </div>
            </div>

            <input
              className="whatif-slider"
              type="range"
              min="-100"
              max="100"
              step="5"
              value={values.paymentFailureChangePercent}
              onChange={(e) =>
                updateValue(
                  "paymentFailureChangePercent",
                  e.target.value,
                )
              }
            />

            <div className="slider-labels">
              <span>-100%</span>
              <span>+100%</span>
            </div>
          </div>

          {/* CHARGEBACK */}
          <div className="whatif-input-card violet">
            <div className="whatif-input-top">
              <div className="whatif-input-icon">
                <ShieldAlert size={18} />
              </div>

              <div>
                <strong>Chargeback Change</strong>
                <span>Chargeback rate change</span>
              </div>

              <div className="whatif-number-input">
                <input
                  type="number"
                  value={values.chargebackChangePercent}
                  min="-100"
                  max="100"
                  onChange={(e) =>
                    updateValue(
                      "chargebackChangePercent",
                      e.target.value,
                    )
                  }
                />
                <span>%</span>
              </div>
            </div>

            <input
              className="whatif-slider"
              type="range"
              min="-100"
              max="100"
              step="5"
              value={values.chargebackChangePercent}
              onChange={(e) =>
                updateValue(
                  "chargebackChangePercent",
                  e.target.value,
                )
              }
            />

            <div className="slider-labels">
              <span>-100%</span>
              <span>+100%</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="whatif-error">
            <AlertTriangle size={17} />
            {error}
          </div>
        )}

        <div className="whatif-run-area">
          <p>
            Set your scenario inputs, then run the simulation to see
            the projected business impact.
          </p>

          <button
            className="run-scenario-button"
            onClick={runScenario}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw size={17} className="spin" />
                Running Scenario...
              </>
            ) : (
              <>
                <FlaskConical size={17} />
                Run Scenario
              </>
            )}
          </button>
        </div>
      </section>

      {/* RESULTS ONLY AFTER RUN */}
      {!result && !loading && (
        <section className="whatif-empty-result">
          <div className="whatif-empty-icon">
            <Sparkles size={25} />
          </div>

          <h2>Ready to simulate</h2>

          <p>
            Adjust the scenario inputs above and click{" "}
            <strong>Run Scenario</strong> to generate financial,
            operational and AI insights.
          </p>
        </section>
      )}

      {loading && (
        <section className="whatif-loading-result">
          <RefreshCw size={25} className="spin" />
          <strong>Analyzing your scenario...</strong>
          <span>
            Calculating financial impact, risk and recommendations.
          </span>
        </section>
      )}

      {result && !loading && (
        <>
          {/* RESULT SUMMARY */}
          <section className="whatif-result-header">
            <div>
              <p className="eyebrow">SCENARIO RESULT</p>
              <h2>Simulation Results</h2>
              <p>
                Based on the business changes you submitted.
              </p>
            </div>

            <div
              className={`scenario-recommendation ${getChangeClass(
                impact?.profitChange,
              )}`}
            >
              {impact?.recommendation === "RECOMMENDED" ? (
                <CheckCircle2 size={17} />
              ) : impact?.recommendation === "NOT RECOMMENDED" ? (
                <XCircle size={17} />
              ) : (
                <AlertTriangle size={17} />
              )}

              {impact?.recommendation || "NEUTRAL"}
            </div>
          </section>

          {/* CURRENT VS SCENARIO */}
          <section className="whatif-comparison-grid">
            <div className="whatif-result-card">
              <span>Current Revenue</span>
              <strong>{formatMoney(current?.revenue)}</strong>
            </div>

            <div className="whatif-result-card purple-border">
              <span>Scenario Revenue</span>
              <strong>
                {formatMoney(scenarioResult?.revenue)}
              </strong>
              {renderChange(impact?.revenueChange)}
            </div>

            <div className="whatif-result-card">
              <span>Current Profit</span>
              <strong>{formatMoney(current?.profit)}</strong>
            </div>

            <div className="whatif-result-card purple-border">
              <span>Scenario Profit</span>
              <strong>
                {formatMoney(scenarioResult?.profit)}
              </strong>
              {renderChange(impact?.profitChange)}
            </div>

            <div className="whatif-result-card">
              <span>Current Orders</span>
              <strong>{formatNumber(current?.orders)}</strong>
            </div>

            <div className="whatif-result-card purple-border">
              <span>Scenario Orders</span>
              <strong>
                {formatNumber(scenarioResult?.orders)}
              </strong>

              <span
                className={`whatif-small-change ${
                  Number(impact?.additionalOrders) >= 0
                    ? "positive"
                    : "negative"
                }`}
              >
                {Number(impact?.additionalOrders) >= 0
                  ? "+"
                  : ""}
                {formatNumber(impact?.additionalOrders)} orders
              </span>
            </div>
          </section>

          {/* RISK + FINANCIAL */}
          <section className="whatif-result-grid">
            <div className="whatif-result-panel">
              <div className="result-panel-header">
                <div>
                  <h3>Operational Risk</h3>
                  <p>Scenario risk assessment</p>
                </div>

                <ShieldAlert size={19} />
              </div>

              <div className="risk-result-main">
                <div>
                  <span>Scenario Risk Score</span>
                  <strong>
                    {scenarioRisk?.score ?? "—"}
                    <small>/100</small>
                  </strong>
                </div>

                <span className={`risk-level ${riskClass}`}>
                  {scenarioRisk?.level || "unknown"}
                </span>
              </div>

              {scenarioRisk?.reasons?.length > 0 && (
                <div className="risk-reasons">
                  {scenarioRisk.reasons.map((reason, index) => (
                    <div key={index}>
                      <AlertTriangle size={13} />
                      {reason}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="whatif-result-panel">
              <div className="result-panel-header">
                <div>
                  <h3>Financial Impact</h3>
                  <p>Projected scenario economics</p>
                </div>

                <IndianRupee size={19} />
              </div>

              <div className="financial-result-grid">
                <div>
                  <span>Discount Cost</span>
                  <strong>
                    {formatMoney(impact?.discountCost)}
                  </strong>
                </div>

                <div>
                  <span>Estimated Recovery</span>
                  <strong className="green-value">
                    {formatMoney(impact?.estimatedRecovery)}
                  </strong>
                </div>

                <div>
                  <span>RTO Recovery</span>
                  <strong>
                    {formatMoney(impact?.rtoRecovery)}
                  </strong>
                </div>

                <div>
                  <span>Refund Recovery</span>
                  <strong>
                    {formatMoney(impact?.refundRecovery)}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          {/* RATE COMPARISON */}
          <section className="whatif-rates-panel">
            <div className="result-panel-header">
              <div>
                <h3>Operational Rate Comparison</h3>
                <p>Current versus simulated business conditions</p>
              </div>

              <Package size={19} />
            </div>

            <div className="rate-comparison-grid">
              <div className="rate-row">
                <span>RTO Rate</span>

                <strong>
                  {formatPercent(current?.rtoRate)}
                </strong>

                <div className="rate-bar">
                  <span
                    style={{
                      width: `${Math.min(
                        100,
                        Number(current?.rtoRate || 0) * 5,
                      )}%`,
                    }}
                  />
                </div>

                <strong className="scenario-rate">
                  {formatPercent(scenarioResult?.rtoRate)}
                </strong>
              </div>

              <div className="rate-row">
                <span>Refund Rate</span>

                <strong>
                  {formatPercent(current?.refundRate)}
                </strong>

                <div className="rate-bar">
                  <span
                    style={{
                      width: `${Math.min(
                        100,
                        Number(current?.refundRate || 0) * 5,
                      )}%`,
                    }}
                  />
                </div>

                <strong className="scenario-rate">
                  {formatPercent(scenarioResult?.refundRate)}
                </strong>
              </div>

              <div className="rate-row">
                <span>Payment Failure</span>

                <strong>
                  {formatPercent(current?.paymentFailureRate)}
                </strong>

                <div className="rate-bar">
                  <span
                    style={{
                      width: `${Math.min(
                        100,
                        Number(
                          current?.paymentFailureRate || 0,
                        ) * 5,
                      )}%`,
                    }}
                  />
                </div>

                <strong className="scenario-rate">
                  {formatPercent(
                    scenarioResult?.paymentFailureRate,
                  )}
                </strong>
              </div>

              <div className="rate-row">
                <span>Chargeback Rate</span>

                <strong>
                  {formatPercent(current?.chargebackRate)}
                </strong>

                <div className="rate-bar">
                  <span
                    style={{
                      width: `${Math.min(
                        100,
                        Number(current?.chargebackRate || 0) * 10,
                      )}%`,
                    }}
                  />
                </div>

                <strong className="scenario-rate">
                  {formatPercent(
                    scenarioResult?.chargebackRate,
                  )}
                </strong>
              </div>
            </div>

            <div className="rate-legend">
              <span>
                <i className="current-dot" />
                Current
              </span>

              <span>
                <i className="scenario-dot" />
                Scenario
              </span>
            </div>
          </section>

          {/* AI ADVISOR */}
          <section className="whatif-ai-panel">
            <div className="whatif-ai-header">
              <div className="whatif-ai-icon">
                <Sparkles size={21} />
              </div>

              <div>
                <div className="ai-title-line">
                  <h2>AI Business Advisor</h2>

                  <span>
                    <Sparkles size={11} />
                    {advice?.aiGenerated
                      ? "AI Generated"
                      : "Rule Based"}
                  </span>
                </div>

                <p>
                  Decision-oriented guidance for this scenario.
                </p>
              </div>
            </div>

            <div className="ai-advice-content">
              {advice?.advice ? (
                advice.advice
                  .split("\n\n")
                  .filter(Boolean)
                  .map((section, index) => {
                    const clean = section
                      .replace(/\*\*/g, "")
                      .trim();

                    const [heading, ...rest] =
                      clean.split("\n");

                    return (
                      <div
                        className="ai-advice-section"
                        key={index}
                      >
                        {rest.length > 0 ? (
                          <>
                            <strong>{heading}</strong>

                            <p>
                              {rest
                                .join(" ")
                                .replace(/^[-•]\s*/gm, "")
                                .trim()}
                            </p>
                          </>
                        ) : (
                          <p>{clean}</p>
                        )}
                      </div>
                    );
                  })
              ) : (
                <p>
                  The scenario was analyzed successfully, but no
                  additional business advice was returned.
                </p>
              )}
            </div>
          </section>

          {/* RUN AGAIN */}
          <div className="whatif-run-again">
            <button
              onClick={() => {
                document
                  .querySelector(".whatif-input-panel")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              <FlaskConical size={16} />
              Modify Scenario
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default WhatIfSimulator;