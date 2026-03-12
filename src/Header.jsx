import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import logo from "/Images/forward-logo.png";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const auth = useMemo(() => {
    const raw = localStorage.getItem("forward_auth_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Work's", path: "/works" },
    { label: "Services", path: "/services" },
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    ...(auth ? [{ label: "Dashboard", path: "/dashboard" }] : []),
    { label: "Sign In", path: "/signin" },
    { label: "Sign Up", path: "/signup" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("forward_auth_user");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="HeaderContainer">
      <div
        style={{
          height: "100px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link to="/" className="LogoLink" aria-label="Forward Agency Home">
          <img src={logo} alt="Forward Agency Logo" className="LogoImage" />
        </Link>
      </div>

      <nav className={`HeaderNav ${isMenuOpen ? "HeaderNavOpen" : ""}`}>
        <ul className="HeaderUl">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="ButtonsContainer">
        <Link to="/get-started" className="HeaderButton HeaderActionLink">
          Subscribe
        </Link>

        <Link to="/contact" className="HeaderButton2 HeaderActionLink">
          Contact
        </Link>

        {auth ? (
          <button type="button" className="HeaderButton" onClick={handleSignOut}>
            Sign Out
          </button>
        ) : null}
      </div>

      <button
        type="button"
        className="MenuToggle"
        aria-label="Toggle navigation menu"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
      </button>
    </header>
  );
}

export default Header;
