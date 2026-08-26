function AnalyticsCharts({ dashboardData, whatIfResult }) {
  if (!dashboardData || !whatIfResult) {
    return null;
  }

  const current = dashboardData;
  const scenario = whatIfResult.scenario;

  // =========================================
  // FORMATTERS
  // =========================================

  const formatCurrency = (value) =>
    `INR ${Number(value || 0).toLocaleString("en-IN")}`;

  // =========================================
  // RISK DATA
  // =========================================

  const currentRisk = [
    ["RTO", current.rtoRate],
    ["Refund", current.refundRate],
    ["Payment Failure", current.paymentFailureRate],
    ["Chargeback", current.chargebackRate],
  ];

  const scenarioRisk = [
    ["RTO", scenario.rtoRate],
    ["Refund", scenario.refundRate],
    ["Payment Failure", scenario.paymentFailureRate],
    ["Chargeback", scenario.chargebackRate],
  ];

  // =========================================
  // FINANCIAL DATA
  // =========================================

  const financialMetrics = [
    {
      label: "Revenue",
      current: Number(current.revenue || 0),
      scenario: Number(scenario.revenue || 0),
      format: formatCurrency,
    },
    {
      label: "Profit",
      current: Number(current.profit || 0),
      scenario: Number(scenario.profit || 0),
      format: formatCurrency,
    },
    {
      label: "Orders",
      current: Number(current.orders || 0),
      scenario: Number(scenario.orders || 0),
      format: (value) => Number(value || 0).toLocaleString("en-IN"),
    },
  ];

  // =========================================
  // MAX RISK
  // =========================================

  const maxRisk = Math.max(
    ...currentRisk.map(([, value]) => Number(value || 0)),
    ...scenarioRisk.map(([, value]) => Number(value || 0)),
    1,
  );

  // =========================================
  // COMPONENT
  // =========================================

  return (
    <section className="analytics-section">
      {/* =========================================
          ANALYTICS HEADER
      ========================================= */}

      <div className="analytics-header">
        <p className="eyebrow">BUSINESS ANALYTICS</p>

        <h2>Scenario Performance</h2>

        <p>
          Compare your current business performance against the simulated
          scenario.
        </p>
      </div>

      <div className="analytics-grid">
        {/* ==================================================
    FINANCIAL COMPARISON
================================================== */}

        <div className="analytics-card analytics-card-wide">
          <div className="analytics-card-header">
            <div>
              <h3>Current vs Scenario</h3>

              <span>Revenue, profit and order comparison</span>
            </div>
          </div>

          <div
            style={{
              padding: "30px 20px 35px",
            }}
          >
            {/* CHART AREA */}

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-evenly",
                gap: "50px",
                minHeight: "300px",
                padding: "20px 20px 0",
                borderBottom: "1px solid #475569",
              }}
            >
              {financialMetrics.map((metric) => {
                const maxValue = Math.max(metric.current, metric.scenario, 1);

                const currentHeight = Math.max(
                  (metric.current / maxValue) * 200,
                  10,
                );

                const scenarioHeight = Math.max(
                  (metric.scenario / maxValue) * 200,
                  10,
                );

                return (
                  <div
                    key={metric.label}
                    style={{
                      flex: "1",
                      maxWidth: "260px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* BARS */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        gap: "35px",
                        height: "250px",
                        width: "100%",
                      }}
                    >
                      {/* CURRENT */}

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          height: "250px",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#e2e8f0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {metric.format(metric.current)}
                        </span>

                        <div
                          style={{
                            width: "52px",
                            height: `${currentHeight}px`,
                            background: "#6366f1",
                            borderRadius: "7px 7px 0 0",
                            transition: "height 0.3s ease",
                          }}
                          title={`Current ${metric.label}: ${metric.format(
                            metric.current,
                          )}`}
                        />

                        <span
                          style={{
                            fontSize: "12px",
                            color: "#cbd5e1",
                          }}
                        >
                          Current
                        </span>
                      </div>

                      {/* SCENARIO */}

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          height: "250px",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#e2e8f0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {metric.format(metric.scenario)}
                        </span>

                        <div
                          style={{
                            width: "52px",
                            height: `${scenarioHeight}px`,
                            background: "#22c55e",
                            borderRadius: "7px 7px 0 0",
                            transition: "height 0.3s ease",
                          }}
                          title={`Scenario ${metric.label}: ${metric.format(
                            metric.scenario,
                          )}`}
                        />

                        <span
                          style={{
                            fontSize: "12px",
                            color: "#cbd5e1",
                          }}
                        >
                          Scenario
                        </span>
                      </div>
                    </div>

                    {/* METRIC NAME */}

                    <div
                      style={{
                        marginTop: "22px",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#f1f5f9",
                      }}
                    >
                      {metric.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================================================
            RISK COMPARISON
        ================================================== */}

        <div className="analytics-card analytics-card-wide">
          <div className="analytics-card-header">
            <div>
              <h3>Operational Risk Comparison</h3>

              <span>
                Lower percentages indicate improved operational performance
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "25px 20px",
            }}
          >
            {currentRisk.map(([name, value], index) => {
              const currentValue = Number(value || 0);

              const scenarioValue = Number(scenarioRisk[index][1] || 0);

              return (
                <div
                  key={name}
                  style={{
                    marginBottom: "24px",
                  }}
                >
                  {/* RISK HEADER */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                      fontSize: "13px",
                    }}
                  >
                    <strong>{name}</strong>
                    <span>
                      {currentValue.toFixed(2)}% vs {scenarioValue.toFixed(2)}%
                    </span>
                  </div>

                  {/* CURRENT */}

                  <div
                    style={{
                      height: "12px",
                      background: "#1e293b",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(
                          (currentValue / maxRisk) * 100,
                          100,
                        )}%`,
                        height: "100%",
                        background: "#6366f1",
                        borderRadius: "10px",
                      }}
                    />
                  </div>

                  {/* SCENARIO */}

                  <div
                    style={{
                      height: "8px",
                      marginTop: "6px",
                      background: "#1e293b",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(
                          (scenarioValue / maxRisk) * 100,
                          100,
                        )}%`,
                        height: "100%",
                        background: "#22c55e",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            CURRENT RISK
        ================================================== */}

        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3>Current Risk Distribution</h3>

              <span>Existing operational risk</span>
            </div>
          </div>

          <div
            style={{
              padding: "25px",
            }}
          >
            {currentRisk.map(([name, value], index) => {
              const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

              const percentage = Number(value || 0);

              return (
                <div
                  key={name}
                  style={{
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <span>{name}</span>

                    <strong>{percentage.toFixed(2)}%</strong>
                  </div>

                  <div
                    style={{
                      height: "14px",
                      background: "#1e293b",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(percentage * 5, 100)}%`,
                        height: "100%",
                        background: colors[index],
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            SCENARIO RISK
        ================================================== */}

        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3>Scenario Risk Distribution</h3>

              <span>Expected risk after changes</span>
            </div>
          </div>

          <div
            style={{
              padding: "25px",
            }}
          >
            {scenarioRisk.map(([name, value], index) => {
              const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

              const percentage = Number(value || 0);

              return (
                <div
                  key={name}
                  style={{
                    marginBottom: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <span>{name}</span>

                    <strong>{percentage.toFixed(2)}%</strong>
                  </div>

                  <div
                    style={{
                      height: "14px",
                      background: "#1e293b",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(percentage * 5, 100)}%`,
                        height: "100%",
                        background: colors[index],
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsCharts;
