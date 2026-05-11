/*
  LOGIN PAGE
  ───────────
  A controlled form with:
  • Email + Password inputs
  • Show/hide password toggle
  • Loading state while API call is in progress
  • Error message from backend displayed inline
  • On success → save token → redirect to previous page or /

  KEY CONCEPTS:
  ─────────────
  CONTROLLED FORM:
    In React, form inputs are "controlled" — we store their
    value in useState and update it on every keystroke.
    This gives us instant access to the current values.

  ASYNC/AWAIT + TRY/CATCH:
    await loginUser(...) waits for the API response.
    try/catch handles errors (wrong password, network error).

  "from" STATE:
    ProtectedRoute saved state={{ from: location }} when it
    redirected to /login. We read it here so after login,
    we send the user back to the page they wanted.
    E.g. user tried to open /favorites → sent to /login →
         logs in → sent back to /favorites ✨
*/

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPaw } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../services/authService";
import styles from "./AuthPage.module.css";

function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after login (the page user tried to visit, or home)
  const from = location.state?.from?.pathname || "/";

  // Form field values
  const [formData, setFormData] = useState({ email: "", password: "" });
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect away from login page
  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  if (isLoggedIn) return null;

  // Update a single field: setFormData({ ...formData, email: "..." })
  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // clear error when user starts typing again
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // data = { userId, name, email, role, token, tokenExpiration }
      const data = await loginUser(formData);

      login(data.token);
      toast.success("Welcome back! 🐾");
      navigate(from, { replace: true });

    } catch (err) {
      // Backend wraps errors as { success: false, message: "..." }
      const msg =
        err.response?.data?.message ||
        "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <FaPaw />
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Sign in to continue your adoption journey
          </p>
        </div>

        {/* Error banner */}
        {error && <div className={styles.errorBanner}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className={styles.inputWrap}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input ${styles.inputWithIcon}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className={styles.labelRow}>
              <label htmlFor="password" className="form-label">Password</label>
            </div>
            <div className={styles.inputWrap}>
              <FaLock className={styles.inputIcon} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`form-input ${styles.inputWithIcon} ${styles.inputWithToggle}`}
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          <span>Don't have an account?</span>
        </div>

        {/* Register link */}
        <Link to="/register" className={`btn btn-ghost ${styles.switchBtn}`}>
          Create a free account
        </Link>

      </div>
    </div>
  );
}

export default LoginPage;
