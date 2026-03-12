import { Link } from "react-router-dom";
import "./Pages.css";

function Subscribe() {
  const isSignedUp = localStorage.getItem("forward_signed_up") === "true";

  return (
    <section className="PageShell">
      <div className="PageHero">
        <p className="PageTag">Subscribe</p>
        <h1 className="PageTitle">Join Forward Growth Updates</h1>
        <p className="PageLead">
          Subscribe to receive campaign tips, content strategy ideas, and practical
          digital marketing updates from FORWARD Agency.
        </p>
      </div>

      {!isSignedUp ? (
        <div className="PageSection">
          <article className="InfoCard" style={{ maxWidth: "620px" }}>
            <h3>Sign Up Required</h3>
            <p>
              To subscribe, please create your account first. After sign-up, you
              will be redirected here automatically.
            </p>
            <div style={{ marginTop: "14px" }}>
              <Link className="PrimaryBtn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "220px" }} to="/signup?next=/subscribe">
                Go to Sign Up
              </Link>
            </div>
          </article>
        </div>
      ) : (
        <div className="PageSection">
          <form className="SignInForm" style={{ maxWidth: "560px" }}>
            <div className="Field">
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" placeholder="Your name" />
            </div>

            <div className="Field">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" placeholder="you@brand.com" />
            </div>

            <button type="button" className="PrimaryBtn">
              Subscribe Now
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

export default Subscribe;
