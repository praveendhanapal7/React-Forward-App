import { Link, useNavigate } from "react-router";
import { useMemo, useState } from "react";
import "./Pages.css";
import { useAuth } from "./auth/useAuth";
import {
  isEmail,
  isIndianPhone,
  passwordStrength,
  requireNonEmpty,
} from "./lib/validation";
import { ApiError } from "./lib/api";

const ROLE_OPTIONS = [
  { value: "client", label: "Brand Owner" },
  { value: "staff", label: "Staff" },
  { value: "agency", label: "Agency Staff" },
];

const STRENGTH_COLORS = {
  "Too weak": "#dc2626",
  Weak: "#f97316",
  Okay: "#eab308",
  Strong: "#16a34a",
};

function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    role: "client",
    brandName: "",
    password: "",
    confirmPassword: "",
    secretKey: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(
    () => passwordStrength(form.password),
    [form.password],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};

    if (!requireNonEmpty(form.fullName)) {
      errors.fullName = "Full name is required.";
    }
    if (!requireNonEmpty(form.email)) {
      errors.email = "Email is required.";
    } else if (!isEmail(form.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!requireNonEmpty(form.phone)) {
      errors.phone = "Phone number is required.";
    } else if (!isIndianPhone(form.phone)) {
      errors.phone = "Enter a valid 10-digit Indian mobile number.";
    }
    if (!requireNonEmpty(form.location)) {
      errors.location = "Location is required.";
    }
    if (form.role === "client" && !requireNonEmpty(form.brandName)) {
      errors.brandName = "Brand name is required for brand owners.";
    }
    if (!form.password) {
      errors.password = "Password is required.";
    } else if (!strength.valid) {
      errors.password =
        "Use at least 8 characters with letters and digits.";
    }
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.confirmPassword !== form.password) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!requireNonEmpty(form.secretKey)) {
      errors.secretKey = "Organization access code is required.";
    }

    return errors;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setAlert(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = {
      name: form.fullName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phone.trim(),
      location: form.location.trim(),
      accountType: form.role,
      password: form.password,
      brandName: form.role === "client" ? form.brandName.trim() : null,
      secretKey: form.secretKey,
    };

    setLoading(true);
    try {
      await signUp(payload);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to create the account. Please try again.";
      setAlert({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const strengthPercent =
    { "Too weak": 10, Weak: 35, Okay: 65, Strong: 100 }[strength.label] ?? 0;

  return (
    <section className="PageShell">
      <div className="PageHero">
        <p className="PageTag">Sign Up</p>
        <h1 className="PageTitle">Create Your FORWARD Account</h1>
        <p className="PageLead">
          Sign up first to access subscriptions, growth updates, and premium
          resources from FORWARD Agency.
        </p>
      </div>

      <div className="PageSection">
        <form
          className="SignInForm"
          style={{ maxWidth: "620px" }}
          onSubmit={handleSignUp}
          noValidate
        >
          <div className="Field">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={form.fullName}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.fullName)}
              required
            />
            {fieldErrors.fullName ? (
              <p className="FieldError">{fieldErrors.fullName}</p>
            ) : null}
          </div>

          <div className="Field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@brand.com"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.email)}
              required
            />
            {fieldErrors.email ? (
              <p className="FieldError">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="Field">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 9XXXXXXXXX"
              value={form.phone}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.phone)}
              required
            />
            {fieldErrors.phone ? (
              <p className="FieldError">{fieldErrors.phone}</p>
            ) : null}
          </div>

          <div className="Field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              autoComplete="address-level2"
              placeholder="City, State"
              value={form.location}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.location)}
              required
            />
            {fieldErrors.location ? (
              <p className="FieldError">{fieldErrors.location}</p>
            ) : null}
          </div>

          <div className="Field">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {form.role === "client" && (
            <div className="Field">
              <label htmlFor="brandName">Brand Name</label>
              <input
                id="brandName"
                name="brandName"
                type="text"
                autoComplete="organization"
                placeholder="Your brand name"
                value={form.brandName}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.brandName)}
                required
              />
              {fieldErrors.brandName ? (
                <p className="FieldError">{fieldErrors.brandName}</p>
              ) : null}
            </div>
          )}

          <div className="Field">
            <label htmlFor="password">Create Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.password)}
              required
            />
            {form.password ? (
              <div className="PasswordStrength" aria-live="polite">
                <span className="PasswordStrengthBar">
                  <span
                    className="PasswordStrengthFill"
                    style={{
                      width: `${strengthPercent}%`,
                      backgroundColor: STRENGTH_COLORS[strength.label],
                    }}
                  />
                </span>
                <span>{strength.label}</span>
              </div>
            ) : (
              <p className="FieldHint">
                At least 8 characters with letters and digits.
              </p>
            )}
            {fieldErrors.password ? (
              <p className="FieldError">{fieldErrors.password}</p>
            ) : null}
          </div>

          <div className="Field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              required
            />
            {fieldErrors.confirmPassword ? (
              <p className="FieldError">{fieldErrors.confirmPassword}</p>
            ) : null}
          </div>

          <div className="Field">
            <label htmlFor="secretKey">
              {form.role === "client"
                ? "Create Organization Access Code"
                : "Enter the Organization Access Code"}
            </label>
            <input
              id="secretKey"
              name="secretKey"
              type="password"
              autoComplete="off"
              placeholder="Access Code"
              value={form.secretKey}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.secretKey)}
              required
            />
            {fieldErrors.secretKey ? (
              <p className="FieldError">{fieldErrors.secretKey}</p>
            ) : null}
          </div>

          <button type="submit" className="PrimaryBtn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {alert ? (
            <p
              className={`FormAlert FormAlert--${alert.type}`}
              role={alert.type === "error" ? "alert" : "status"}
            >
              {alert.message}
            </p>
          ) : null}

          <p className="MutedText">
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
