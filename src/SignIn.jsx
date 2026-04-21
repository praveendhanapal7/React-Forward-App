import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import "./Pages.css";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "./auth/useAuth";
import { isEmail } from "./lib/validation";
import { ApiError } from "./lib/api";

const portalItems = [
  "Weekly target performance summary",
  "Campaign status and quality-check updates",
  "Creative delivery history and revision notes",
  "Enquiry response tracking and follow-up status",
  "Support channel for fast communication",
];

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!isEmail(email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }
    return errors;
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setAlert(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
      const redirectTo = location.state?.from || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to sign in. Please try again.";
      setAlert({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="PageShell">
      <div className="PageHero">
        <p className="PageTag">Client Portal</p>
        <h1 className="PageTitle">
          Sign In for Reports, Progress, and Deliverables
        </h1>
        <p className="PageLead">
          This portal is designed for Forward clients and staff who need clear
          visibility into campaign progress, lead requirements, and execution
          updates.
        </p>
      </div>

      <div className="SignInWrap">
        <div className="InfoCard">
          <h3>What You Can Access</h3>
          <p>
            Staff can add lead numbers and requirements. Clients can view all
            lead entries and track updates from one dashboard.
          </p>
          <ul className="FeatureList">
            {portalItems.map((item) => (
              <li key={item}>
                <FaCheckCircle />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <form className="SignInForm" onSubmit={handleSignIn} noValidate>
          <div className="Field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@brand.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              required
            />
            {fieldErrors.email ? (
              <p className="FieldError">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="Field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              required
            />
            {fieldErrors.password ? (
              <p className="FieldError">{fieldErrors.password}</p>
            ) : null}
          </div>

          <button type="submit" className="PrimaryBtn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
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
            Need portal access? Contact Forward Agency support team.
          </p>
          <p className="MutedText">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
