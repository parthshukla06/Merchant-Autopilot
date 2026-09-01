import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ReceiptText,
  AlertTriangle,
  RotateCcw,
  WalletCards,
  ShieldAlert,
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

const API_URL = "https://merchant-autopilot.onrender.com";
const MERCHANT_ID = "6a89dccdcc29ecf53a7612f3";

const PAGE_SIZE = 6;

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const fetchTransactions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        `${API_URL}/api/transactions/merchant/${MERCHANT_ID}`,
      );

      const data = response.data?.data;

      if (Array.isArray(data)) {
        setTransactions(data);
      } else if (Array.isArray(data?.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Transactions error:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getValue = (transaction, keys, fallback = "") => {
    for (const key of keys) {
      if (
        transaction?.[key] !== undefined &&
        transaction?.[key] !== null
      ) {
        return transaction[key];
      }
    }

    return fallback;
  };

  const normalizedTransactions = useMemo(() => {
    return transactions.map((transaction, index) => {
      const id = getValue(
        transaction,
        ["transactionId", "transaction_id", "id", "_id", "orderId"],
        `TXN-${index + 1}`,
      );

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
          [
            "paymentMethod",
            "payment_method",
            "method",
            "paymentType",
          ],
          "card",
        ),
      );

      const date = getValue(
        transaction,
        [
          "transactionDate",
          "createdAt",
          "created_at",
          "date",
        ],
        null,
      );

      const order = String(
        getValue(
          transaction,
          [
            "orderStatus",
            "order_status",
            "deliveryStatus",
          ],
          "delivered",
        ),
      );

      const rawStatus = String(
        getValue(
          transaction,
          [
            "transactionStatus",
            "status",
            "paymentStatus",
          ],
          "",
        ),
      ).toLowerCase();

      const rawOrder = order.toLowerCase();

      /*
       * IMPORTANT:
       * Chargeback is a separate boolean in the backend model.
       * Do not turn it into a fake transaction status.
       */
      const isChargeback =
        transaction?.isChargeback === true ||
        String(transaction?.isChargeback).toLowerCase() === "true";

      let status = "successful";

      if (isChargeback) {
        status = "chargeback";
      } else if (
        rawStatus.includes("fail") ||
        rawOrder.includes("fail")
      ) {
        status = "failed";
      } else if (
        rawStatus.includes("refund") ||
        rawOrder.includes("refund")
      ) {
        status = "refunded";
      } else if (
        rawStatus.includes("rto") ||
        rawOrder.includes("rto") ||
        rawOrder.includes("return")
      ) {
        status = "rto";
      } else if (rawStatus.includes("pending")) {
        status = "pending";
      } else if (
        rawStatus.includes("success") ||
        rawStatus.includes("complete") ||
        rawStatus.includes("paid") ||
        rawStatus.includes("delivered")
      ) {
        status = "successful";
      }

      return {
        ...transaction,
        displayId: String(id),
        amount,
        payment,
        date,
        order,
        status,
        isChargeback,
      };
    });
  }, [transactions]);

  const stats = useMemo(() => {
    const total = normalizedTransactions.length;

    const failed = normalizedTransactions.filter(
      (transaction) => transaction.status === "failed",
    ).length;

    const rto = normalizedTransactions.filter(
      (transaction) => transaction.status === "rto",
    ).length;

    const refunded = normalizedTransactions.filter(
      (transaction) => transaction.status === "refunded",
    ).length;

    const chargebacks = normalizedTransactions.filter(
      (transaction) => transaction.isChargeback,
    ).length;

    return {
      total,
      failed,
      rto,
      refunded,
      chargebacks,
    };
  }, [normalizedTransactions]);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return normalizedTransactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        transaction.displayId.toLowerCase().includes(query) ||
        transaction.payment.toLowerCase().includes(query) ||
        transaction.order.toLowerCase().includes(query) ||
        transaction.status.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        transaction.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    normalizedTransactions,
    search,
    statusFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const visibleTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const percentage = (value) => {
    if (!stats.total) return "0.00";
    return ((value / stats.total) * 100).toFixed(2);
  };

  const formatMoney = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  const formatDate = (value) => {
    if (!value) return "23 Aug 2026";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusConfig = {
    successful: {
      label: "Successful",
      icon: CheckCircle2,
      className: "success",
    },

    failed: {
      label: "Failed",
      icon: XCircle,
      className: "danger",
    },

    refunded: {
      label: "Refunded",
      icon: RotateCcw,
      className: "warning",
    },

    rto: {
      label: "RTO",
      icon: RotateCcw,
      className: "warning",
    },

    chargeback: {
      label: "Chargeback",
      icon: ShieldAlert,
      className: "danger",
    },

    pending: {
      label: "Pending",
      icon: Clock3,
      className: "pending",
    },
  };

  const renderStatus = (status) => {
    const config =
      statusConfig[status] || statusConfig.pending;

    const Icon = config.icon;

    return (
      <span
        className={`transaction-status ${config.className}`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="page-state">
        <RefreshCw className="spin" />
        <h2>Loading transactions...</h2>
        <p>
          Fetching the latest merchant transaction activity.
        </p>
      </div>
    );
  }

  return (
    <div className="page transactions-page">
      <header className="page-header transactions-header">
        <div>
          <p className="eyebrow">OPERATIONS</p>

          <h1>Transactions</h1>

          <p className="page-subtitle">
            Monitor transaction behaviour and identify
            operational patterns.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={() => fetchTransactions(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={refreshing ? "spin" : ""}
          />
          Refresh
        </button>
      </header>

      {/* KPI CARDS */}
      <section className="transaction-stats">
        <div className="transaction-stat-card purple">
          <div className="transaction-stat-icon">
            <ReceiptText size={21} />
          </div>

          <div>
            <span>Total Transactions</span>
            <strong>{stats.total}</strong>
            <small>All time</small>
          </div>
        </div>

        <div className="transaction-stat-card orange">
          <div className="transaction-stat-icon">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>Failed Payments</span>
            <strong>{stats.failed}</strong>
            <small>
              {percentage(stats.failed)}% of total
            </small>
          </div>
        </div>

        <div className="transaction-stat-card blue">
          <div className="transaction-stat-icon">
            <RotateCcw size={21} />
          </div>

          <div>
            <span>RTO</span>
            <strong>{stats.rto}</strong>
            <small>
              {percentage(stats.rto)}% of total
            </small>
          </div>
        </div>

        <div className="transaction-stat-card green">
          <div className="transaction-stat-icon">
            <WalletCards size={21} />
          </div>

          <div>
            <span>Refunds</span>
            <strong>{stats.refunded}</strong>
            <small>
              {percentage(stats.refunded)}% of total
            </small>
          </div>
        </div>

        <div className="transaction-stat-card red">
          <div className="transaction-stat-icon">
            <ShieldAlert size={21} />
          </div>

          <div>
            <span>Chargebacks</span>
            <strong>{stats.chargebacks}</strong>
            <small>
              {percentage(stats.chargebacks)}% of total
            </small>
          </div>
        </div>
      </section>

      {/* TRANSACTIONS */}
      <section className="transactions-panel">
        <div className="transaction-toolbar">
          <div className="transaction-search">
            <Search size={19} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search transaction or payment method..."
            />
          </div>

          <div className="transaction-filter">
            <CalendarDays size={17} />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="all">
                All Transactions
              </option>

              <option value="successful">
                Successful
              </option>

              <option value="failed">
                Failed
              </option>

              <option value="rto">
                RTO
              </option>

              <option value="refunded">
                Refunded
              </option>

              <option value="chargeback">
                Chargebacks
              </option>

              <option value="pending">
                Pending
              </option>
            </select>
          </div>
        </div>

        <div className="transactions-table-wrap">
          <table className="transactions-table">
            <colgroup>
              <col className="col-transaction" />
              <col className="col-date" />
              <col className="col-amount" />
              <col className="col-payment" />
              <col className="col-status" />
              <col className="col-order" />
            </colgroup>

            <thead>
              <tr>
                <th>TRANSACTION</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>PAYMENT</th>
                <th>STATUS</th>
                <th>ORDER</th>
              </tr>
            </thead>

            <tbody>
              {visibleTransactions.map(
                (transaction, index) => (
                  <tr
                    key={`${transaction.displayId}-${index}`}
                  >
                    <td>
                      <div className="transaction-name">
                        <div
                          className={`transaction-row-icon ${
                            index % 3 === 1
                              ? "orange"
                              : "purple"
                          }`}
                        >
                          <ReceiptText size={17} />
                        </div>

                        <strong>
                          {transaction.displayId}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <div className="transaction-date">
                        <span>
                          {formatDate(transaction.date)}
                        </span>

                        {formatTime(transaction.date) && (
                          <small>
                            {formatTime(transaction.date)}
                          </small>
                        )}
                      </div>
                    </td>

                    <td>
                      <strong className="transaction-amount">
                        {formatMoney(transaction.amount)}
                      </strong>
                    </td>

                    <td>
                      <span className="payment-method">
                        {transaction.payment}
                      </span>
                    </td>

                    <td>
                      {renderStatus(transaction.status)}
                    </td>

                    <td>
                      <span className="order-status">
                        {transaction.order}
                      </span>
                    </td>
                  </tr>
                ),
              )}

              {!visibleTransactions.length && (
                <tr>
                  <td colSpan="6">
                    <div className="empty-transactions">
                      <Search size={24} />

                      <strong>
                        No transactions found
                      </strong>

                      <span>
                        Try changing your search or
                        transaction filter.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="transaction-footer">
          <span>
            Showing{" "}
            {filteredTransactions.length
              ? (currentPage - 1) * PAGE_SIZE + 1
              : 0}{" "}
            to{" "}
            {Math.min(
              currentPage * PAGE_SIZE,
              filteredTransactions.length,
            )}{" "}
            of {filteredTransactions.length} transactions
          </span>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setPage((value) =>
                  Math.max(1, value - 1),
                )
              }
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from(
              {
                length: Math.min(totalPages, 5),
              },
              (_, index) => index + 1,
            ).map((number) => (
              <button
                key={number}
                className={
                  currentPage === number
                    ? "active"
                    : ""
                }
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((value) =>
                  Math.min(
                    totalPages,
                    value + 1,
                  ),
                )
              }
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Transactions;