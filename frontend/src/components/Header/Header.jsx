import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ModalContext } from "../../contexts/ModalContext";
import { ActiveSectionContext } from "../../contexts/ActiveSectionContext";
import logo from "../../assets/logo1.png";
import styles from "./Header.module.css";

const Header = ({ scrollToSection }) => {
  const { isModalOpen } = useContext(ModalContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { activeSection, setActiveSection } = useContext(ActiveSectionContext);
  if (isModalOpen) return null;

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleScroll = (section) => {
    if (
      location.pathname === "/terms" ||
      location.pathname === "/privacy" ||
      location.pathname === "/admin"
    ) {
      navigate("/");
      setTimeout(() => scrollToSection(section), 100);
    } else {
      scrollToSection(section);
    }
    setActiveSection(section);
    setMenuOpen(false);
  };

  const navItems = [
    { label: t("homeLink"), section: "top" },
    { label: t("aboutUs"), section: "about" },
    { label: t("form"), section: "booking" },
    { label: t("questions"), section: "faq" },
    { label: t("contact"), section: "contact" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <button
          onClick={() => handleScroll("top")}
          className={styles.logoButton}
          aria-label={t("homeLink")}
        >
          <img
            className={styles.headerLogo}
            src={logo}
            alt="LogoBusTransportation"
          />
        </button>

        <div
          className={styles.hamburger}
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleMenu();
          }}
          aria-label="Toggle navigation menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>
        <nav className={`${styles.navBar} ${menuOpen ? styles.open : ""}`}>
          {navItems.map(({ label, section }) => (
            <button
              key={section}
              className={`${styles.navLink} ${
                activeSection === section ? styles.activeNavLink : ""
              }`}
              onClick={() => handleScroll(section)}
              aria-label={`Scroll to ${label}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
