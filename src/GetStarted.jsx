import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaCheckCircle, FaBullhorn } from "react-icons/fa";

import "./Pages.css";

const inclusions = [
  "Competitor Analysis",
  "Content Planning",
  "Script Writing",
  "Voice Over",
  "Video Editing",
  "Social Media Management",
  "Meta Ads",
  "Enquiry Responses",
  "Google Business Management",
];

function GetStarted() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const details = useMemo(() => {
    const raw = localStorage.getItem("forward_purchase_details");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const handleSendEnquiry = async () => {
    if (!details || isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      await apiRequest("/api/enquiries", {
        method: "POST",
        body: JSON.stringify({
          brandName: details.brandName,
          ownerName: details.ownerName,
          email: details.email,
          phone: details.phone,
          goal: details.goal,
          planPrice: "13999 INR",
        }),
      });

      setStatusMessage("Your enquiry has been sent, you'll get the response soon.");
    } catch (error) {
      setStatusMessage(error.message || "Unable to send enquiry now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!details) {
    return <Navigate to="/get-started" replace />;
  }

  return (
    <section className="PageShell">
      <div className="PageHero">
        <p className="PageTag">Get Started</p>
        <h1 className="PageTitle">Purchase the FORWARD Growth Plan</h1>
        <p className="PageLead">
          This plan is designed for businesses that need strategy, content, ad
          execution, and enquiry support from one focused team.
        </p>
      </div>

      <div className="PageSection">
        <article className="InfoCard HighlightCard">
          <div className="IconTitle">
            <span className="CardIcon">
              <FaBullhorn />
            </span>
            <h3>Complete Package Price</h3>
          </div>
          <p>
            Full service plan covering analysis to execution: <strong>₹13,999</strong>
          </p>
        </article>
      </div>

      <div className="PageSection">
        <h2 className="PageSectionTitle">What You Get</h2>
        <article className="InfoCard">
          <ul className="FeatureList">
            {inclusions.map((item) => (
              <li key={item}>
                <FaCheckCircle />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="PageSection" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          type="button"
          className="PrimaryBtn"
          style={{
            maxWidth: "300px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleSendEnquiry}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Contact Team to Complete Purchase"}
        </button>
        <Link className="PrimaryBtn" style={{ maxWidth: "220px", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#fff", color: "#ce050d" }} to="/services">
          View Services
        </Link>
      </div>

      {statusMessage ? (
        <div className="PageSection">
          <article className="InfoCard">
            <p>{statusMessage}</p>
          </article>
        </div>
      ) : null}
    </section>
  );
}

export default GetStarted;
