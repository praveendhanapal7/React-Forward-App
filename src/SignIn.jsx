import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Pages.css";
import { FaCheckCircle } from "react-icons/fa";

const portalItems = [
  "Weekly target performance summary",
  "Campaign status and quality-check updates",
  "Creative delivery history and revision notes",
  "Enquiry response tracking and follow-up status",
  "Support channel for fast communication",
];

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      console.log("trying");

      const auth = await fetch("http://localhost:8090/user/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const authSign = await auth.json();
      console.log(authSign);

      if (auth.ok) {
        navigate("/dashboard", { state: authSign });
      } else {
        setStatus("Invalid credentials");
          setLoading(false);
      }
    } catch (error) {
      console.log(error);
      navigate("/signin");
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

        <form className="SignInForm" onSubmit={handleSignIn}>
          <div className="Field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@brand.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="Field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="PrimaryBtn" disabled={isSubmitting}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {status ? <p className="MutedText">{status}</p> : null}
          <p className="MutedText">
            Need portal access? Contact Forward Agency support team.
          </p>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
