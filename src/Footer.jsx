import "./Footer.css";

function Footer() {
  return (
    <footer className="FooterSection">
      <div className="FooterTop">
        <div className="FooterBrand">
          <h3>FORWARD AGENCY</h3>
          <p>
            We help brands grow visibility, generate quality leads, and scale
            with strategic digital marketing systems.
          </p>
        </div>

        <div className="FooterLinks">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Sign In</a>
            </li>
          </ul>
        </div>

        <div className="FooterContact">
          <h4>Contact</h4>
          <p>Email: forwardenquiries@gmail.com</p>
          <p>Phone: +91 9361045774</p>
          <p>Phone: +91 9443069400</p>
          <p>Location:Ondipudur Coimbatore ,  Tamil Nadu, India</p>
        </div>
      </div>

      <div className="FooterBottom">
        <p>© 2026 FORWARD Agency. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
