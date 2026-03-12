import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "./Pages.css";

const includedServices = [
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

function GetStartedDetails() {
  const navigate = useNavigate();

  const handleContinue = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      brandName: formData.get("brandName"),
      ownerName: formData.get("ownerName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      goal: formData.get("goal"),
    };
    localStorage.setItem("forward_purchase_details", JSON.stringify(payload));
    navigate("/purchase");
  };

  return (
    <section className="PageShell">
      <div className="PageHero">
        <p className="PageTag">Get Started</p>
        <h1 className="PageTitle">Tell Us About Your Business</h1>
        <p className="PageLead">
          Share a few details so we can align your package and move you to the
          purchase page with the right plan context.
        </p>
      </div>

      <div className="PageSection">
        <div className="DetailsLayout">
          <article className="InfoCard DetailsLeft">
            <h3 style={{ marginBottom: "10px" }}>Included Services Before Purchase</h3>
            <ul className="FeatureList">
              {includedServices.map((service) => (
                <li key={service}>
                  <FaCheckCircle />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </article>

          <form className="SignInForm DetailsRight" onSubmit={handleContinue}>
            <div className="Field">
              <label htmlFor="brand-name">Brand Name</label>
              <input id="brand-name" name="brandName" type="text" placeholder="Your brand name" required />
            </div>

            <div className="Field">
              <label htmlFor="owner-name">Owner / Contact Person</label>
              <input id="owner-name" name="ownerName" type="text" placeholder="Your name" required />
            </div>

            <div className="Field">
              <label htmlFor="contact-email">Email Address</label>
              <input id="contact-email" name="email" type="email" placeholder="you@brand.com" required />
            </div>

            <div className="Field">
              <label htmlFor="contact-phone">Phone Number</label>
              <input id="contact-phone" name="phone" type="tel" placeholder="+91 9XXXXXXXXX" required />
            </div>

            <div className="Field">
              <label htmlFor="goal">Primary Goal</label>
              <input id="goal" name="goal" type="text" placeholder="Leads / Sales / Brand Awareness" required />
            </div>

            <button type="submit" className="PrimaryBtn">
              Continue to Purchase
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default GetStartedDetails;
