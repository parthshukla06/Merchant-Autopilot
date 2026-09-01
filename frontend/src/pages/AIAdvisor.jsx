import { useEffect, useState } from "react";
import axios from "axios";
import {
  Sparkles,
  ShieldAlert,
  TrendingUp,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  Target,
  ArrowRight,
} from "lucide-react";

const API_URL = "https://merchant-autopilot.onrender.com";
const MERCHANT_ID = "6a89dccdcc29ecf53a7612f3";

function AIAdvisor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdvice = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/api/merchants/${MERCHANT_ID}/ai-explanation`,
        {
          timeout: 20000,
        },
      );

      setData(response.data?.data || null);
    } catch (error) {
      console.error("AI Advisor error:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  const formatMoney = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const extractSection = (text, title) => {
    if (!text) return "";

    const sections = text
      .split(/\n\s*\n/)
      .map((section) => section.trim())
      .filter(Boolean);

    const match = sections.find((section) =>
      section.toLowerCase().startsWith(title.toLowerCase()),
    );

    if (!match) return "";

    return match
      .replace(new RegExp(`^${title}\\s*:?[\\s\\S]?`, "i"), "")
      .trim();
  };

  if (loading) {
    return (
      <div className="page-state">
        <RefreshCw className="spin" size={28} />
        <h2>Loading AI Business Advisor...</h2>
        <p>Analyzing merchant intelligence and financial signals.</p>
      </div>
    );
  }

  if (!data?.aiExplanation) {
    return (
      <div className="page-state">
        <ShieldAlert size={40} />
        <h2>Unable to load AI Advisor</h2>
        <p>Please refresh and try again.</p>

        <button className="primary-button" onClick={fetchAdvice}>
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  const ai = data.aiExplanation;
  const metadata = ai.metadata || {};
  const explanation = ai.explanation || "";

  const executiveSummary =
    extractSection(explanation, "Executive Summary") ||
    "Merchant is currently operating within acceptable conditions.";

  const financialInsight =
    extractSection(explanation, "Key Financial Insight") ||
    "Financial exposure should be reviewed and prioritized.";

  const confirmedRisk = extractSection(explanation, "Confirmed Money At Risk");

  const recoverable = extractSection(explanation, "Recoverable Opportunity");

  const totalExposure = extractSection(explanation, "Total Financial Exposure");

  const criticalIssues =
    extractSection(explanation, "Critical Issues") ||
    "No critical anomalies detected.";

  const highPriorityIssues =
    extractSection(explanation, "High Priority Issues") ||
    "No high-priority anomalies detected.";

  const recommendedActions =
    extractSection(explanation, "Recommended Actions") ||
    "Prioritize the largest source of financial exposure before addressing smaller leakage sources.";

  const priority = metadata?.priority || metadata?.overallPriority || "low";

  return (
    <div className="page ai-advisor-page">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="page-header">
        <div>
          <p className="eyebrow">INTELLIGENCE</p>

          <h1>AI Business Advisor</h1>

          <p className="page-subtitle">
            Actionable intelligence to help you make better merchant decisions.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchAdvice}
          title="Refresh AI analysis"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </header>

      {/* =====================================================
          AI HERO
      ===================================================== */}
      <section className="advisor-hero">
        <div className="advisor-hero-icon">
          <Sparkles size={25} />
        </div>

        <div className="advisor-hero-content">
          <div className="advisor-hero-label">
            <span>AI ANALYSIS</span>
            <small>Merchant Intelligence Engine</small>
          </div>

          <h2>Here's what your business needs to know.</h2>

          <p>{executiveSummary}</p>
        </div>

        <div className={`advisor-priority ${priority.toLowerCase()}`}>
          <span>Business Priority</span>
          <strong>{priority.toUpperCase()}</strong>
        </div>
      </section>

      {/* =====================================================
          FINANCIAL INTELLIGENCE
      ===================================================== */}
      <section className="advisor-section">
        <div className="advisor-section-heading">
          <p className="eyebrow">FINANCIAL INTELLIGENCE</p>
          <h2>Where your money stands</h2>
        </div>

        <div className="advisor-financial-grid">
          <FinancialCard
            type="risk"
            icon={<ShieldAlert size={21} />}
            label="Confirmed Money At Risk"
            value={
              confirmedRisk ||
              formatMoney(
                data?.aiExplanation?.financialOverview?.confirmedMoneyAtRisk,
              )
            }
            description="Confirmed financial leakage"
          />

          <FinancialCard
            type="success"
            icon={<TrendingUp size={21} />}
            label="Recoverable Opportunity"
            value={
              recoverable ||
              formatMoney(
                data?.aiExplanation?.financialOverview?.recoverableOpportunity,
              )
            }
            description="Potential recovery opportunity"
          />

          <FinancialCard
            type="purple"
            icon={<Wallet size={21} />}
            label="Total Financial Exposure"
            value={
              totalExposure ||
              formatMoney(
                data?.aiExplanation?.financialOverview?.totalFinancialExposure,
              )
            }
            description="Total identified exposure"
          />
        </div>
      </section>

      {/* =====================================================
          KEY BUSINESS INSIGHT
      ===================================================== */}
      <section className="advisor-insight-card">
        <div className="advisor-insight-icon">
          <Lightbulb size={22} />
        </div>

        <div>
          <p className="eyebrow">KEY BUSINESS INSIGHT</p>

          <h2>What deserves your attention?</h2>

          <p>{financialInsight}</p>
        </div>
      </section>

      {/* =====================================================
          ISSUES
      ===================================================== */}
      <section className="advisor-issues-grid">
        <IssueCard
          type="critical"
          icon={<ShieldAlert size={21} />}
          title="Critical Issues"
          subtitle="Needs immediate attention"
          count={criticalIssues.toLowerCase().includes("no critical") ? 0 : "!"}
          text={criticalIssues}
        />

        <IssueCard
          type="warning"
          icon={<AlertTriangle size={21} />}
          title="High Priority Issues"
          subtitle="Worth addressing next"
          count={
            highPriorityIssues.toLowerCase().includes("no high-priority")
              ? 0
              : "!"
          }
          text={highPriorityIssues}
        />
      </section>

      {/* =====================================================
          RECOMMENDED ACTIONS
      ===================================================== */}
      <section className="advisor-actions-card">
        <div className="advisor-card-header">
          <div className="advisor-card-title">
            <div className="advisor-card-icon purple">
              <Target size={21} />
            </div>

            <div>
              <h2>Recommended Actions</h2>
              <p>Prioritized actions from Merchant Autopilot</p>
            </div>
          </div>

          <span className="advisor-ai-badge">
            <Sparkles size={13} />
            AI Powered
          </span>
        </div>

        <div className="advisor-action-list">
          {recommendedActions
            .split("\n")
            .map((action) => action.trim())
            .filter(Boolean)
            .map((action, index) => (
              <div className="advisor-action-item" key={index}>
                <span className="advisor-action-number">{index + 1}</span>

                <div>
                  {(() => {
                    const cleanAction = action.replace(/^\d+\.\s*/, "");
                    const parts = cleanAction.split("—");

                    return (
                      <>
                        <strong>{parts[0].trim()}</strong>

                        {parts[1] && <p>{parts.slice(1).join("—").trim()}</p>}
                      </>
                    );
                  })()}
                </div>

                <ArrowRight size={17} />
              </div>
            ))}
        </div>
      </section>

      {/* =====================================================
          DECISION EXPLANATION
      ===================================================== */}
      <section className="advisor-reasoning-card">
        <div className="advisor-card-header">
          <div className="advisor-card-title">
            <div className="advisor-card-icon blue">
              <Sparkles size={21} />
            </div>

            <div>
              <p className="eyebrow">AI REASONING</p>
              <h2>Why this matters</h2>
              <p>
                A concise explanation of what the intelligence means for your
                business.
              </p>
            </div>
          </div>

          <span className="advisor-reasoning-badge">Decision Support</span>
        </div>

        <div className="advisor-reasoning-grid">
          <ReasoningCard
            number="01"
            title="What happened"
            icon={<Lightbulb size={18} />}
            text={executiveSummary}
          />

          <ReasoningCard
            number="02"
            title="Why it matters"
            icon={<ShieldAlert size={18} />}
            text={`${financialInsight} ${
              confirmedRisk ? `Current exposure: ${confirmedRisk}.` : ""
            }`}
          />

          <ReasoningCard
            number="03"
            title="What to do next"
            icon={<Target size={18} />}
            text={recommendedActions.replace(/^\d+\.\s*/, "").trim()}
          />
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   FINANCIAL CARD
========================================================= */

function FinancialCard({ type, icon, label, value, description }) {
  return (
    <div className={`advisor-financial-card ${type}`}>
      <div className="advisor-financial-icon">{icon}</div>

      <span>{label}</span>

      <strong>{value || "—"}</strong>

      <small>{description}</small>
    </div>
  );
}

/* =========================================================
   ISSUE CARD
========================================================= */

function IssueCard({ type, icon, title, subtitle, count, text }) {
  return (
    <div className={`advisor-issue-card ${type}`}>
      <div className="advisor-issue-top">
        <div className="advisor-issue-icon">{icon}</div>

        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <span className="advisor-issue-count">{count}</span>
      </div>

      <div className="advisor-issue-body">
        <CheckCircle2 size={18} />
        <span>{text}</span>
      </div>
    </div>
  );
}

/* =========================================================
   REASONING CARD
========================================================= */

function ReasoningCard({ number, title, icon, text }) {
  return (
    <div className="advisor-reasoning-item">
      <div className="advisor-reasoning-number">{number}</div>

      <div className="advisor-reasoning-item-icon">{icon}</div>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default AIAdvisor;
