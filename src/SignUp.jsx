import { Link, useNavigate } from "react-router";
import { useState } from "react";
import "./Pages.css";

function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState("client");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const form = new FormData(event.currentTarget);

    const payload = {
      name: form.get("fullName"),
      email: form.get("email"),
      phoneNumber: form.get("phone"),
      location: form.get("location"),
      accountType: form.get("role"),
      password: form.get("password"),
      brandName: role === "client" ? form.get("brandName") : null,
      secretKey: form.get("secretKey"),
    };

    try {
      const response = await fetch("http://localhost:8010/add/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let userContent = null;

      if (text) {
        try {
          userContent = JSON.parse(text);
        } catch {
          userContent = null;
        }
      }

      if (!response.ok) {
        setStatus(
          userContent?.message ||
            "Unable to create the account. The email may already be in use / Access code was wrong"
        );
        return;
      }

      if (!userContent) {
        setStatus("Account created, but the server returned an invalid response.");
        return;
      }

      localStorage.setItem("forward_auth_user", JSON.stringify(userContent));
      navigate("/dashboard", { state: userContent });
    } catch (error) {
      console.error("Sign up failed:", error);
      setStatus("Unable to reach the server right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
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
        >
          <div className="Field">
            <label>Full Name</label>
            <input name="fullName" type="text" placeholder="Your name" required />
          </div>

          <div className="Field">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="you@brand.com" required />
          </div>

          <div className="Field">
            <label>Phone Number</label>
            <input name="phone" type="tel" placeholder="+91 9XXXXXXXXX" required />
          </div>

          <div className="Field">
            <label>Location</label>
            <input name="location" type="text" placeholder="City, State" required />
          </div>

          <div className="Field">
            <label>Account Type</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="client">Brand Owner</option>
              <option value="staff"> Staff</option>
              <option value="Agency Staff"> Agency Staff</option>

            </select>
          </div>

          {role === "client" && (
            <div className="Field">
              <label>Brand Name</label>
              <input name="brandName" type="text" placeholder="Your brand name" required />
            </div>
          )}

          <div className="Field">
            <label>Create Password</label>
            <input name="password" type="password" placeholder="Create password" required />
          </div>



           <div className="Field">
             {role === "client" ?
            <label>Create Organization Access Code</label>:  <label>Enter the Organization Access Code</label>}
            <input name="secretKey" type="password" placeholder="Access Code" required />
          </div>

          <button type="submit" className="PrimaryBtn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {status ? <p className="MutedText">{status}</p> : null}

          <p className="MutedText">
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
