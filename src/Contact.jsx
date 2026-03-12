import "./Pages.css";

function Contact() {
  return (
    <section className="PageShell">
      <div className="PageHero">
        <p className="PageTag">Contact</p>
        <h1 className="PageTitle">Talk to FORWARD Team</h1>
        <p className="PageLead">
          Share your business goals and we’ll recommend a practical growth plan
          across strategy, content, ads, and enquiry workflows.
        </p>
      </div>

      <div className="SignInWrap">
        <article className="InfoCard">
          <h3>Contact Details</h3>
          <p>Email: hello@forwardagency.in</p>
          <p style={{ marginTop: "8px" }}>Phone: +91 93610 45774</p>
          <p style={{ marginTop: "8px" }}>Phone: +91 94430 69400</p>
          <p style={{ marginTop: "8px" }}>Location: Ondipudur Coimbatore ,Tamil Nadu, India</p>
        </article>

        <form className="SignInForm">
          <div className="Field">
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" type="text" placeholder="Your name" />
          </div>

          <div className="Field">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" type="email" placeholder="you@brand.com" />
          </div>

          <div className="Field">
            <label htmlFor="contact-message">Message</label>
            <input id="contact-message" type="text" placeholder="Tell us your requirement" />
          </div>

          <button type="button" className="PrimaryBtn">
            Send Enquiry
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
