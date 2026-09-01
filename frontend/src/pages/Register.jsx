import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
  ShieldCheck,
} from "lucide-react";

import { saveAuth } from "../auth/auth";

const API_URL = "https://merchant-autopilot.onrender.com";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
        }
      );

      const { token, user } = response.data.data;

      saveAuth(token, user);

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
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
            MERCHANT DECISION INTELLIGENCE
          </span>

          <h1>
            Build a smarter
            <br />
            business workspace.
          </h1>

          <p>
            Create your merchant account and start
            monitoring risk, financial exposure and
            business scenarios.
          </p>
        </div>

        <div className="auth-panel-footer">
          <span>Merchant Autopilot</span>
          <span>Secure Merchant Workspace</span>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-heading">
            <span>GET STARTED</span>

            <h2>Create your account</h2>

            <p>
              Set up your merchant intelligence workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="auth-label">
              Full name
            </label>

            <div className="auth-input">
              <UserRound size={18} />

              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) =>
                  update("name", e.target.value)
                }
                autoComplete="name"
              />
            </div>

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
                type={
                  showPassword ? "text" : "password"
                }
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) =>
                  update("password", e.target.value)
                }
                autoComplete="new-password"
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

            <label className="auth-label">
              Confirm password
            </label>

            <div className="auth-input">
              <LockKeyhole size={18} />

              <input
                type={
                  showConfirm ? "text" : "password"
                }
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={(e) =>
                  update(
                    "confirmPassword",
                    e.target.value
                  )
                }
                autoComplete="new-password"
              />

              <button
                type="button"
                className="auth-eye"
                onClick={() =>
                  setShowConfirm((prev) => !prev)
                }
              >
                {showConfirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
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
                "Creating account..."
              ) : (
                <>
                  Create account
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className="auth-register">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>

          <p className="auth-security">
            <ShieldCheck size={14} />
            Passwords are securely hashed before storage.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;