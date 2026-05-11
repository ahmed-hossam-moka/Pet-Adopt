/*
  REGISTER PAGE
  ──────────────
  A multi-field form with ROLE SELECTION.

  ROLES (from the backend):
  • Adopter     → can browse and adopt pets
  • Shelter     → manages a shelter, posts multiple pets
  • PetOwner    → individual owner, posts their own pets

  Note on Shelter/PetOwner:
    After registration, their account status is "Pending" and
    must be APPROVED by Admin before they can post pets.
    The Admin will see them in "Pending Accounts" (Phase 6).

  PASSWORD VALIDATION:
    We validate on the frontend before sending to backend:
    • Min 8 characters
    • At least one uppercase letter
    • At least one number
    This gives instant feedback without a network round-trip.
*/

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaPaw, FaHome, FaDog, FaHeart, FaCheck
} from "react-icons/fa";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import { registerUser } from "../services/authService";
import styles from "./AuthPage.module.css";

// Role cards shown as clickable options
const ROLES = [
  {
    value: "Adopter",
    label: "Adopter",
    icon: <FaHeart />,
    desc: "I want to adopt a pet",
  },
  {
    value: "Shelter",
    label: "Shelter",
    icon: <FaHome />,
    desc: "I manage an animal shelter",
  },
  {
    value: "PetOwner",
    label: "Pet Owner",
    icon: <FaDog />,
    desc: "I have pets to rehome",
  },
];

function validatePassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Must include at least one uppercase letter.";
  if (!/[0-9]/.test(password)) return "Must include at least one number.";
  return null; // null = valid
}

function RegisterPage() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "Adopter",   // default role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [errors, setErrors]             = useState({});

  // If the user is already logged in, redirect away from this page.
  // We use useEffect so this runs AFTER render — not DURING render.
  // Calling navigate() during render causes a React warning:
  // "Cannot update a component while rendering a different component"
  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  // Don't render the form while redirect is happening
  if (isLoggedIn) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function selectRole(role) {
    setFormData((prev) => ({ ...prev, role }));
  }

  // Basic client-side validation
  function validate() {
    const newErrors = {};
    if (!formData.name.trim())    newErrors.name = "Full name is required.";
    if (!formData.email.includes("@")) newErrors.email = "Enter a valid email.";

    const pwdError = validatePassword(formData.password);
    if (pwdError) newErrors.password = pwdError;

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true = no errors
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name:     formData.name.trim(),
        email:    formData.email.trim(),
        password: formData.password,
        role:     formData.role,
      };

      const data = await registerUser(payload);
      // data = { userId, name, email, role, token, tokenExpiration }

      if (formData.role === "Adopter") {
        // Adopter gets a token immediately → log them in right away
        login(data.token);
        toast.success("Welcome to PetAdopt! 🐾 Start browsing pets.");
        navigate("/browse");
      } else {
        // Shelter / PetOwner → backend returns token = null
        // They must wait for Admin approval before they can log in
        toast.success(
          "Account created! ✅ Awaiting Admin approval before you can log in.",
          { duration: 6000 }
        );
        navigate("/login");
      }
    } catch (err) {
      // Backend error is wrapped: { success: false, message: "..." }
      const msg =
        err.response?.data?.message ||
        "Registration failed. This email may already be in use.";
      setErrors({ api: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${styles.registerCard}`}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrap}><FaPaw /></div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join thousands of pet lovers today</p>
        </div>

        {/* API-level error */}
        {errors.api && <div className={styles.errorBanner}>{errors.api}</div>}

        {/* ── STEP 1: Choose your role ── */}
        <div className={styles.stepSection}>
          <p className={styles.stepLabel}>Step 1 — I am a...</p>
          <div className={styles.roleGrid}>
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                className={`${styles.roleCard} ${formData.role === r.value ? styles.roleActive : ""}`}
                onClick={() => selectRole(r.value)}
              >
                <span className={styles.roleIcon}>{r.icon}</span>
                <span className={styles.roleLabel}>{r.label}</span>
                <span className={styles.roleDesc}>{r.desc}</span>
                {formData.role === r.value && (
                  <FaCheck className={styles.roleCheck} />
                )}
              </button>
            ))}
          </div>

          {/* Warning for non-Adopter roles */}
          {formData.role !== "Adopter" && (
            <div className={styles.infoBox}>
              ⚠️ Shelter & Pet Owner accounts require Admin approval before
              you can post pets. You'll receive a notification once approved.
            </div>
          )}
        </div>

        <div className={styles.divider}><span>Step 2 — Your details</span></div>

        {/* ── STEP 2: Account details form ── */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <div className={styles.inputWrap}>
              <FaUser className={styles.inputIcon} />
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input ${styles.inputWithIcon} ${errors.name ? styles.inputError : ""}`}
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email Address</label>
            <div className={styles.inputWrap}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                id="reg-email"
                name="email"
                type="email"
                className={`form-input ${styles.inputWithIcon} ${errors.email ? styles.inputError : ""}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <div className={styles.inputWrap}>
              <FaLock className={styles.inputIcon} />
              <input
                id="reg-password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`form-input ${styles.inputWithIcon} ${styles.inputWithToggle} ${errors.password ? styles.inputError : ""}`}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className={styles.inputWrap}>
              <FaLock className={styles.inputIcon} />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                className={`form-input ${styles.inputWithIcon} ${styles.inputWithToggle} ${errors.confirmPassword ? styles.inputError : ""}`}
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="form-error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? (
              <><span className={styles.spinner} /> Creating account...</>
            ) : (
              `Create ${formData.role} Account`
            )}
          </button>
        </form>

        <div className={styles.divider}><span>Already have an account?</span></div>
        <Link to="/login" className={`btn btn-ghost ${styles.switchBtn}`}>
          Sign in instead
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;
