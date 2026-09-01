import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  CalendarDays,
  Download,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  WalletCards,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_URL = "https://merchant-autopilot.onrender.com";
const MERCHANT_ID = "6a89dccdcc29ecf53a7612f3";

function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [intelligence, setIntelligence] = useState(null);
  const [mlRisk, setMlRisk] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const results = await Promise.allSettled([
        axios.get(`${API_URL}/api/transactions/merchant/${MERCHANT_ID}`, {
          timeout: 20000,
        }),

        axios.get(`${API_URL}/api/merchants/${MERCHANT_ID}/intelligence`, {
          timeout: 20000,
        }),

        axios.get(`${API_URL}/api/merchants/${MERCHANT_ID}/ml-risk`, {
          timeout: 20000,
        }),
      ]);

      // -----------------------------------------
      // TRANSACTIONS
      // -----------------------------------------

      const transactionsResult = results[0];

      if (transactionsResult.status === "fulfilled") {
        const transactionData = transactionsResult.value.data?.data;

        if (Array.isArray(transactionData)) {
          setTransactions(transactionData);
        } else if (Array.isArray(transactionData?.transactions)) {
          setTransactions(transactionData.transactions);
        } else {
          setTransactions([]);
        }
      } else {
        console.error("Transactions API failed:", transactionsResult.reason);

        setTransactions([]);
      }

      // -----------------------------------------
      // MERCHANT INTELLIGENCE
      // -----------------------------------------

      const intelligenceResult = results[1];

      if (intelligenceResult.status === "fulfilled") {
        setIntelligence(intelligenceResult.value.data?.data || null);
      } else {
        console.error("Intelligence API failed:", intelligenceResult.reason);

        setIntelligence(null);
      }

      // -----------------------------------------
      // ML RISK
      // -----------------------------------------

      const mlRiskResult = results[2];

      if (mlRiskResult.status === "fulfilled") {
        setMlRisk(mlRiskResult.value.data?.data || null);
      } else {
        console.error("ML Risk API failed:", mlRiskResult.reason);

        setMlRisk(null);
      }
    } catch (error) {
      console.error("Analytics unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const getValue = (transaction, keys, fallback = "") => {
    for (const key of keys) {
      if (transaction?.[key] !== undefined && transaction?.[key] !== null) {
        return transaction[key];
      }
    }

    return fallback;
  };

  const normalized = useMemo(() => {
    return transactions.map((transaction) => {
      const amount = Number(
        getValue(
          transaction,
          ["amount", "transactionAmount", "totalAmount"],
          0,
        ),
      );

      const payment = String(
        getValue(
          transaction,
          ["paymentMethod", "payment_method", "method", "paymentType"],
          "Other",
        ),
      ).toLowerCase();

      const rawStatus = String(
        getValue(
          transaction,
          ["status", "paymentStatus", "transactionStatus"],
          "",
        ),
      ).toLowerCase();

      const orderStatus = String(
        getValue(
          transaction,
          ["orderStatus", "order_status", "deliveryStatus"],
          "",
        ),
      ).toLowerCase();

      let status = "successful";

      if (rawStatus.includes("fail") || orderStatus.includes("fail")) {
        status = "failed";
      } else if (
        rawStatus.includes("refund") ||
        orderStatus.includes("refund")
      ) {
        status = "refunded";
      } else if (
        rawStatus.includes("rto") ||
        orderStatus.includes("rto") ||
        orderStatus.includes("return")
      ) {
        status = "rto";
      } else if (rawStatus.includes("pending")) {
        status = "pending";
      }

      return {
        amount,
        payment,
        status,
        date: getValue(
          transaction,
          ["createdAt", "created_at", "date", "transactionDate"],
          null,
        ),
      };
    });
  }, [transactions]);

  const stats = useMemo(() => {
    const total = normalized.length;

    const failed = normalized.filter((item) => item.status === "failed").length;

    const rto = normalized.filter((item) => item.status === "rto").length;

    const refunded = normalized.filter(
      (item) => item.status === "refunded",
    ).length;

    const successful = normalized.filter(
      (item) => item.status === "successful",
    ).length;

    const totalValue = normalized.reduce((sum, item) => sum + item.amount, 0);

    return {
      total,
      failed,
      rto,
      refunded,
      successful,
      totalValue,

      successRate: total ? (successful / total) * 100 : 0,

      failureRate: total ? (failed / total) * 100 : 0,

      rtoRate: total ? (rto / total) * 100 : 0,

      refundRate: total ? (refunded / total) * 100 : 0,

      chargebackRate: Number(mlRisk?.features?.chargeback_rate ?? 0),
    };
  }, [normalized, mlRisk]);

  const paymentData = useMemo(() => {
    const map = {};

    normalized.forEach((transaction) => {
      const payment = transaction.payment || "other";
      map[payment] = (map[payment] || 0) + 1;
    });

    const colors = ["#6947ff", "#3b82f6", "#55bd87", "#f59e42", "#a0a8b8"];

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value], index) => ({
        name:
          name === "upi" ? "UPI" : name.charAt(0).toUpperCase() + name.slice(1),

        value,

        percentage: stats.total
          ? ((value / stats.total) * 100).toFixed(1)
          : "0.0",

        fill: colors[index],
      }));
  }, [normalized, stats.total]);

  const statusData = useMemo(() => {
    const items = [
      {
        name: "Successful",
        value: stats.successful,
        fill: "#55bd87",
      },
      {
        name: "Failed",
        value: stats.failed,
        fill: "#ef4b5f",
      },
      {
        name: "RTO",
        value: stats.rto,
        fill: "#f5a142",
      },
      {
        name: "Refunded",
        value: stats.refunded,
        fill: "#4b83e8",
      },
    ];

    return items.filter((item) => item.value > 0);
  }, [stats]);

  const trendData = useMemo(() => {
    const map = {};

    normalized.forEach((transaction) => {
      if (!transaction.date) return;

      const date = new Date(transaction.date);

      if (Number.isNaN(date.getTime())) return;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const key = `${year}-${month}-${day}`;

      if (!map[key]) {
        map[key] = {
          date: key,
          amount: 0,
          transactions: 0,
        };
      }

      map[key].amount += transaction.amount;
      map[key].transactions += 1;
    });

    return Object.values(map)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7)
      .map((item) => {
        const [year, month, day] = item.date.split("-").map(Number);

        const localDate = new Date(year, month - 1, day);

        return {
          ...item,
          label: localDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
        };
      });
  }, [normalized]);

  const topDays = useMemo(() => {
    return [...trendData].sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [trendData]);

  const formatMoney = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  const formatPercent = (value) => `${Number(value || 0).toFixed(2)}%`;

  const handleDownload = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Transactions", stats.total],
      ["Gross Transaction Value", stats.totalValue],
      ["Success Rate", formatPercent(stats.successRate)],
      ["Failure Rate", formatPercent(stats.failureRate)],
      ["RTO Rate", formatPercent(stats.rtoRate)],
      ["Refund Rate", formatPercent(stats.refundRate)],
      ["Chargeback Rate", formatPercent(stats.chargebackRate)],
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "merchant-autopilot-analytics.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="page-state">
        <RefreshCw className="spin" />
        <h2>Loading analytics...</h2>
        <p>Preparing merchant performance insights.</p>
      </div>
    );
  }

  return (
    <div className="page analytics-page">
      {/* HEADER */}
      <header className="page-header analytics-header">
        <div>
          <p className="eyebrow">ANALYTICS</p>

          <h1>Analytics</h1>

          <p className="page-subtitle">
            Deep insights into business performance and operational metrics.
          </p>
        </div>

        <div className="analytics-actions">
          <div className="analytics-date">
            <CalendarDays size={17} />

            <span>
              {trendData.length === 1
                ? "1 transaction day available"
                : `${trendData.length} transaction days available`}
            </span>
          </div>

          <button className="analytics-download" onClick={handleDownload}>
            <Download size={16} />
            Download
          </button>
        </div>
      </header>

      {/* KPI CARDS */}
      <section className="analytics-kpis">
        <div className="analytics-kpi purple">
          <div className="analytics-kpi-icon">
            <span>₹</span>
          </div>

          <div>
            <span>Gross Transaction Value</span>

            <strong>{formatMoney(stats.totalValue)}</strong>

            <small className="positive">Current period</small>
          </div>
        </div>

        <div className="analytics-kpi green">
          <div className="analytics-kpi-icon">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>Total Transactions</span>

            <strong>{stats.total}</strong>

            <small className="positive">Current performance</small>
          </div>
        </div>

        <div className="analytics-kpi blue">
          <div className="analytics-kpi-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Success Rate</span>

            <strong>{formatPercent(stats.successRate)}</strong>

            <small className="positive">Current performance</small>
          </div>
        </div>

        <div className="analytics-kpi orange">
          <div className="analytics-kpi-icon">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>Failure Rate</span>

            <strong>{formatPercent(stats.failureRate)}</strong>

            <small className="positive">Current performance</small>
          </div>
        </div>

        <div className="analytics-kpi red">
          <div className="analytics-kpi-icon">
            <ShieldAlert size={21} />
          </div>

          <div>
            <span>Chargeback Rate</span>

            <strong>{formatPercent(stats.chargebackRate)}</strong>

            <small className="positive">Current risk indicator</small>
          </div>
        </div>
      </section>

      {/* MAIN CHARTS */}
      <section className="analytics-chart-grid">
        {/* TRANSACTION TREND */}
        <div className="analytics-card trend-card">
          <div className="analytics-card-header">
            <div>
              <h2>Transaction Trend</h2>

              <p>Daily transaction value</p>

              {trendData.length === 1 && (
                <div className="analytics-data-note">
                  Showing the only available transaction day.
                </div>
              )}
            </div>

            <span className="chart-legend">
              <i />
              Available Period
            </span>
          </div>

          <div className="chart-container">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient
                      id="transactionGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#6947ff"
                        stopOpacity={0.24}
                      />

                      <stop offset="100%" stopColor="#6947ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="#edf0f5" vertical={false} />

                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#718096",
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#718096",
                      fontSize: 11,
                    }}
                    tickFormatter={(value) =>
                      value >= 1000 ? `${Math.round(value / 1000)}K` : value
                    }
                  />

                  <Tooltip
                    formatter={(value) => [formatMoney(value), "Value"]}
                    contentStyle={{
                      border: "1px solid #e1e6ef",
                      borderRadius: 10,
                      boxShadow: "0 8px 25px rgba(15,23,42,.08)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#6947ff"
                    strokeWidth={2.5}
                    fill="url(#transactionGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                <BarChart3 size={28} />
                <span>No trend data available</span>
              </div>
            )}
          </div>
        </div>

        {/* PAYMENT DISTRIBUTION */}
        <div className="analytics-card payment-card">
          <div className="analytics-card-header">
            <div>
              <h2>Payment Method Distribution</h2>

              <p>Transactions by payment method</p>
            </div>
          </div>

          <div className="payment-chart-area">
            {paymentData.length > 0 ? (
              <>
                <div className="donut-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={92}
                        paddingAngle={2}
                      >
                        {paymentData.map((entry, index) => (
                          <Cell key={`payment-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="donut-center">
                    <strong>{stats.total}</strong>

                    <span>Total</span>
                  </div>
                </div>

                <div className="payment-legend">
                  {paymentData.map((item) => (
                    <div key={item.name}>
                      <span>
                        <i
                          style={{
                            background: item.fill,
                          }}
                        />

                        {item.name}
                      </span>

                      <strong>{item.percentage}%</strong>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="chart-empty">
                <WalletCards size={28} />
                <span>No payment data</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LOWER GRID */}
      <section className="analytics-lower-grid">
        {/* STATUS */}
        <div className="analytics-card status-card">
          <div className="analytics-card-header">
            <div>
              <h2>Status Breakdown</h2>

              <p>Current transaction outcomes</p>
            </div>
          </div>

          <div className="status-content">
            <div className="status-donut">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={73}
                    paddingAngle={2}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`status-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div>
                <strong>{stats.total}</strong>

                <span>Total</span>
              </div>
            </div>

            <div className="status-list">
              {statusData.map((item) => (
                <div key={item.name}>
                  <span>
                    <i
                      style={{
                        background: item.fill,
                      }}
                    />

                    {item.name}
                  </span>

                  <strong>
                    {item.value} (
                    {stats.total
                      ? ((item.value / stats.total) * 100).toFixed(2)
                      : "0.00"}
                    %)
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-link">
            View all transactions
            <ArrowUpRight size={15} />
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="analytics-card activity-card">
          <div className="analytics-card-header">
            <div>
              <h2>Hourly Activity</h2>

              <p>Transaction activity distribution</p>
            </div>
          </div>

          <div className="activity-bars">
            {Array.from({ length: 24 }, (_, index) => {
              const hourTransactions = normalized.filter((transaction) => {
                if (!transaction.date) return false;

                const date = new Date(transaction.date);

                return date.getHours() === index;
              }).length;

              const max = Math.max(
                ...Array.from(
                  { length: 24 },
                  (_, hour) =>
                    normalized.filter((transaction) => {
                      if (!transaction.date) {
                        return false;
                      }

                      return new Date(transaction.date).getHours() === hour;
                    }).length,
                ),
                1,
              );

              const height = Math.max(8, (hourTransactions / max) * 100);

              return (
                <div
                  className="activity-column"
                  key={index}
                  title={`${index}:00 — ${hourTransactions} transactions`}
                >
                  <div
                    className="activity-bar"
                    style={{
                      height: `${height}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="activity-labels">
            <span>12 AM</span>
            <span>4 AM</span>
            <span>8 AM</span>
            <span>12 PM</span>
            <span>4 PM</span>
            <span>8 PM</span>
          </div>

          <div className="activity-scale">
            <span>Low Activity</span>

            <div>
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <span>High Activity</span>
          </div>
        </div>

        {/* TOP DAYS */}
        <div className="analytics-card top-days-card">
          <div className="analytics-card-header">
            <div>
              <h2>Top Performing Days</h2>

              <p>Highest transaction value</p>
            </div>
          </div>

          <div className="top-days-list">
            {topDays.length > 0 ? (
              topDays.map((day, index) => (
                <div className="top-day" key={day.date}>
                  <span className="day-rank">{index + 1}.</span>

                  <div className="day-info">
                    <strong>
                      {new Date(day.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </strong>

                    <div className="day-progress">
                      <span
                        style={{
                          width: `${
                            topDays[0]?.amount
                              ? (day.amount / topDays[0].amount) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <strong className="day-value">
                    {formatMoney(day.amount)}
                  </strong>
                </div>
              ))
            ) : (
              <div className="chart-empty">
                <span>No daily data available</span>
              </div>
            )}
          </div>

          <div className="analytics-link">
            View detailed report
            <ArrowUpRight size={15} />
          </div>
        </div>
      </section>

      {/* AI INSIGHT */}
      <section className="analytics-ai">
        <div className="analytics-ai-icon">
          <Sparkles size={22} />
        </div>

        <div className="analytics-ai-content">
          <span>Key Insight</span>

          <p>
            {intelligence?.intelligence?.keyInsight ||
              `Your current success rate is ${formatPercent(
                stats.successRate,
              )}. ${
                paymentData[0]?.name || "Your primary payment method"
              } is currently the most used payment method.`}
          </p>
        </div>

        <button
          onClick={() => {
            window.location.href = "/ai-advisor";
          }}
        >
          View AI Recommendations
          <ArrowUpRight size={16} />
        </button>
      </section>
    </div>
  );
}

export default Analytics;
