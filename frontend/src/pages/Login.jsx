import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { saveAuth } from "../auth/auth";
import "./Auth.css";

const API_URL = "https://merchant-autopilot.onrender.com";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const useDemoAccount = () => {
    setForm({
      email: "demo@merchantautopilot.ai",
      password: "Demo@123",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        form
      );

      saveAuth(response.data.token, response.data.user);

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-background-glow auth-glow-one" />
      <div className="auth-background-glow auth-glow-two" />

      <div className="auth-shell">
        <section className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-logo">
              <div className="auth-logo-mark">M</div>

              <div className="auth-logo-text">
                <strong>Merchant</strong>
                <span>Autopilot</span>
              </div>
            </div>

            <div className="auth-eyebrow">
              <Sparkles size={15} />
              AI-POWERED MERCHANT INTELLIGENCE
            </div>

            <h1>
              Make smarter
              <span>merchant decisions.</span>
            </h1>

            <p className="auth-brand-description">
              Monitor business risk, simulate decisions and turn
              merchant data into actionable intelligence.
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature">
                <div className="auth-feature-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <strong>ML-powered risk intelligence</strong>
                  <span>
                    Identify financial and operational risks early.
                  </span>
                </div>
              </div>

              <div className="auth-feature">
                <div className="auth-feature-icon">
                  <BarChart3 size={18} />
                </div>

                <div>
                  <strong>Scenario-based decision analysis</strong>
                  <span>
                    Understand the impact before taking action.
                  </span>
                </div>
              </div>

              <div className="auth-feature">
                <div className="auth-feature-icon">
                  <BrainCircuit size={18} />
                </div>

                <div>
                  <strong>AI-powered business recommendations</strong>
                  <span>
                    Convert merchant data into practical actions.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-brand-footer">
            <span>Merchant Autopilot</span>
            <span>Decision Intelligence Platform</span>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-wrapper">
            <div className="auth-mobile-logo">
              <div className="auth-logo-mark">M</div>

              <div className="auth-logo-text">
                <strong>Merchant</strong>
                <span>Autopilot</span>
              </div>
            </div>

            <div className="auth-form-header">
              <div className="auth-small-label">
                WELCOME BACK
              </div>

              <h2>Sign in to your workspace</h2>

              <p>
                Access your merchant intelligence dashboard.
              </p>
            </div>

            {error && (
              <div className="auth-error">
                <div className="auth-error-dot" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="email">Email address</label>

                <div className="auth-input-wrapper">
                  <Mail size={18} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>

                <div className="auth-input-wrapper">
                  <LockKeyhole size={18} />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="auth-demo-button"
              onClick={useDemoAccount}
            >
              <CheckCircle2 size={18} />

              <span>
                <strong>Use Demo Account</strong>
                <small>Instantly load demo credentials</small>
              </span>
            </button>

            <div className="auth-switch">
              <span>Don't have an account?</span>

              <Link to="/register">
                Create account
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="auth-security-note">
              <ShieldCheck size={16} />

              <span>
                Your account is protected with secure authentication.
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
