function AnalyticsCharts({ dashboardData, whatIfResult }) {
  if (!dashboardData || !whatIfResult) {
    return null;
  }

  const current = dashboardData;
  const scenario = whatIfResult.scenario;

  const formatCurrency = (value) =>
    `INR ${Number(value || 0).toLocaleString("en-IN")}`;

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

  const maxFinancial = Math.max(
    Number(current.revenue || 0),
    Number(scenario.revenue || 0),
    Number(current.profit || 0),
    Number(scenario.profit || 0),
    1,
  );

  const maxRisk = Math.max(
    ...currentRisk.map(([, value]) => Number(value || 0)),
    ...scenarioRisk.map(([, value]) => Number(value || 0)),
    1,
  );

  return (
    <section className="analytics-section">
      <div className="analytics-header">
        <p className="eyebrow">BUSINESS ANALYTICS</p>

        <h2>Scenario Performance</h2>

        <p>
          Compare your current business performance against the simulated
          scenario.
        </p>
      </div>

      <div className="analytics-grid">
        {/* FINANCIAL COMPARISON */}
        <div className="analytics-card analytics-card-wide">
          <div className="analytics-card-header">
            <div>
              <h3>Current vs Scenario</h3>
              <span>Revenue, profit and order comparison</span>
            </div>
          </div>

          <div
            style={{
              padding: "30px 20px",
              minHeight: "280px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
                height: "220px",
                gap: "30px",
                borderBottom: "1px solid #475569",
              }}
            >
              <div style={barGroup}>
                <div
                  style={{
                    ...barStyle,
                    height: `${Math.max(
                      (Number(current.revenue || 0) / maxFinancial) * 180,
                      10,
                    )}px`,
                    background: "#6366f1",
                  }}
                  title={`Current Revenue: ${formatCurrency(current.revenue)}`}
                />
                <span>Revenue</span>
              </div>

              <div style={barGroup}>
                <div
                  style={{
                    ...barStyle,
                    height: `${Math.max(
                      (Number(scenario.revenue || 0) / maxFinancial) * 180,
                      10,
                    )}px`,
                    background: "#22c55e",
                  }}
                  title={`Scenario Revenue: ${formatCurrency(
                    scenario.revenue,
                  )}`}
                />
                <span>Scenario</span>
              </div>

              <div style={barGroup}>
                <div
                  style={{
                    ...barStyle,
                    height: `${Math.max(
                      (Number(current.profit || 0) / maxFinancial) * 180,
                      10,
                    )}px`,
                    background: "#8b5cf6",
                  }}
                  title={`Current Profit: ${formatCurrency(current.profit)}`}
                />
                <span>Profit</span>
              </div>

              <div style={barGroup}>
                <div
                  style={{
                    ...barStyle,
                    height: `${Math.max(
                      (Number(scenario.profit || 0) / maxFinancial) * 180,
                      10,
                    )}px`,
                    background: "#14b8a6",
                  }}
                  title={`Scenario Profit: ${formatCurrency(scenario.profit)}`}
                />
                <span>Scenario</span>
              </div>
            </div>
          </div>
        </div>

        {/* RISK COMPARISON */}
        <div className="analytics-card analytics-card-wide">
          <div className="analytics-card-header">
            <div>
              <h3>Operational Risk Comparison</h3>
              <span>
                Lower percentages indicate improved operational performance
              </span>
            </div>
          </div>

          <div style={{ padding: "25px 20px" }}>
            {currentRisk.map(([name, value], index) => {
              const currentValue = Number(value || 0);
              const scenarioValue = Number(scenarioRisk[index][1] || 0);

              return (
                <div key={name} style={{ marginBottom: "22px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                      fontSize: "13px",
                    }}
                  >
                    <strong>{name}</strong>
                    <span>
                      {currentValue.toFixed(2)}% → {scenarioValue.toFixed(2)}%
                    </span>
                  </div>

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

                  <div
                    style={{
                      height: "8px",
                      marginTop: "5px",
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

        {/* CURRENT RISK */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3>Current Risk Distribution</h3>
              <span>Existing operational risk</span>
            </div>
          </div>

          <div style={{ padding: "25px" }}>
            {currentRisk.map(([name, value], index) => {
              const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

              const percentage = Number(value || 0);

              return (
                <div key={name} style={{ marginBottom: "18px" }}>
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

        {/* SCENARIO RISK */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3>Scenario Risk Distribution</h3>
              <span>Expected risk after changes</span>
            </div>
          </div>

          <div style={{ padding: "25px" }}>
            {scenarioRisk.map(([name, value], index) => {
              const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

              const percentage = Number(value || 0);

              return (
                <div key={name} style={{ marginBottom: "18px" }}>
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

const barGroup = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-end",
  height: "220px",
  gap: "8px",
  minWidth: "60px",
};

const barStyle = {
  width: "45px",
  minHeight: "10px",
  borderRadius: "6px 6px 0 0",
};

export default AnalyticsCharts;
