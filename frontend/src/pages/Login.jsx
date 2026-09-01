import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { saveAuth } from "../auth/auth";

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

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        form
      );

      const { token, user } = response.data.data;

      saveAuth(token, user);

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccount = () => {
    setForm({
      email: "demo@merchantautopilot.ai",
      password: "Demo@123",
    });

    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="auth-brand">
          <div className="auth-brand-mark">M</div>

          <div>
            <strong>Merchant</strong>
            <span>Autopilot</span>
          </div>
        </div>

        <div className="auth-brand-content">
          <span className="auth-kicker">
            <Sparkles size={14} />
            AI-POWERED MERCHANT INTELLIGENCE
          </span>

          <h1>
            Make smarter
            <br />
            merchant decisions.
          </h1>

          <p>
            Monitor business risk, simulate decisions and turn
            merchant data into actionable intelligence.
          </p>

          <div className="auth-feature-list">
            <div>
              <ShieldCheck size={18} />
              <span>ML-powered risk intelligence</span>
            </div>

            <div>
              <ShieldCheck size={18} />
              <span>Scenario-based decision analysis</span>
            </div>

            <div>
              <ShieldCheck size={18} />
              <span>AI-powered business recommendations</span>
            </div>
          </div>
        </div>

        <div className="auth-panel-footer">
          <span>Merchant Autopilot</span>
          <span>Decision Intelligence Platform</span>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-heading">
            <span>WELCOME BACK</span>

            <h2>Sign in to your workspace</h2>

            <p>
              Access your merchant intelligence dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="auth-label">
              Email address
            </label>

            <div className="auth-input">
              <Mail size={18} />

              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) =>
                  update("email", e.target.value)
                }
                autoComplete="email"
              />
            </div>

            <label className="auth-label">
              Password
            </label>

            <div className="auth-input">
              <LockKeyhole size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  update("password", e.target.value)
                }
                autoComplete="current-password"
              />

              <button
                type="button"
                className="auth-eye"
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

            <div className="auth-options">
              <label className="remember-option">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-button"
                onClick={() =>
                  setError(
                    "Password reset will be available in the production account flow."
                  )
                }
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

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
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-social-row">
            <button
              type="button"
              onClick={useDemoAccount}
            >
              Use Demo Account
            </button>
          </div>

          <div className="auth-demo-box">
            <div>
              <strong>Hackathon Demo</strong>
              <span>
                Instantly load demo credentials
              </span>
            </div>

            <button
              type="button"
              onClick={useDemoAccount}
            >
              Load
            </button>
          </div>

          <p className="auth-register">
            Don't have an account?{" "}
            <Link to="/register">
              Create account
            </Link>
          </p>

          <p className="auth-security">
            <ShieldCheck size={14} />
            Your account is protected with secure
            authentication.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;