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
      <section className="auth-brand-panel">
        <div className="auth-brand">
          <div className="auth-brand-mark">M</div>

          <div>
            <strong>Merchant</strong>
            <span>Autopilot</span>
          </div>
        </div>

        <div className="auth-brand-content">
          <span className="auth-kicker">
            <Sparkles size={15} />
            AI-POWERED MERCHANT INTELLIGENCE
          </span>

          <h1>
            Make smarter
            <span>merchant decisions.</span>
          </h1>

          <p>
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

        <div className="auth-panel-footer">
          <span>Merchant Autopilot</span>
          <span>Decision Intelligence Platform</span>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-heading">
            <span>WELCOME BACK</span>
            <h2>Sign in to your workspace</h2>
            <p>Access your merchant intelligence dashboard.</p>
          </div>

          {error && (
            <div className="auth-error">
              <div className="auth-error-dot" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                Email address
              </label>

              <div className="auth-input">
                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Password
              </label>

              <div className="auth-input">
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
                  className="auth-eye"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
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
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
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
            className="auth-demo"
            onClick={useDemoAccount}
          >
            <CheckCircle2 size={18} />

            <span>
              <strong>Use Demo Account</strong>
              <small>Instantly load demo credentials</small>
            </span>
          </button>

          <div className="auth-register">
            <span>Don't have an account?</span>

            <Link to="/register">
              Create account
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="auth-security">
            <ShieldCheck size={16} />

            <span>
              Your account is protected with secure authentication.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
