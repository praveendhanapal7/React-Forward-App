import { Link } from "react-router-dom";
import "./CTASection.css";

function CTASection() {
  return (
    <section className="CTASection">
      <div className="CTAInner">
        <p className="CTATag">Let’s Build Your Growth Engine</p>
        <h2 className="CTATitle">Ready to Scale Your Brand with FORWARD?</h2>
        <p className="CTADescription">
          Get a focused strategy session for your business and discover the next
          growth opportunities across ads, content, and brand positioning.
        </p>

        <div className="CTAButtons">
          <Link
            to="/contact"
            className="CTAButton HeroBtn HeroBtnPrimary HeroBtnLink"
          >
            Book Free Strategy Call
          </Link>
          <Link
            to="/contact"
            className="CTAButton HeroBtn HeroBtnSecondary HeroBtnLink"
          >
            Get Proposal
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
