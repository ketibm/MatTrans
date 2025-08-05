import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import CompanyMap from "../Location/CompanyMap";
import MapPopup from "../Popup/MapPopup";
import { ActiveSectionContext } from "../../contexts/ActiveSectionContext";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import instagram from "../../assets/instagram.png";
import facebook from "../../assets/facebook.png";
import linkedin from "../../assets/linkedin.png";
import styles from "./Footer.module.css";

const Footer = ({ scrollToSection }) => {
  const { t } = useTranslation();
  const { setActiveSection } = useContext(ActiveSectionContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 769);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 769);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleQuickLink = (section) => {
    setActiveSection(section);
    if (location.pathname === "/terms" || location.pathname === "/privacy") {
      navigate("/", { state: { scrollTo: section } });
    } else {
      scrollToSection(section);
    }
  };

  const toggleMap = () => setShowMap((prev) => !prev);

  const renderContact = () => (
    <>
      <p onClick={toggleMap} style={{ cursor: "pointer" }}>
        <FaMapMarkerAlt className={styles.icon} /> {t("address")}
      </p>
      <p>
        <a href="tel:+38975309477">
          <FaPhoneAlt className={styles.icon} /> +389 75 309 477
        </a>
      </p>
      <p>
        <a href="mailto:mattransdooel@gmail.com">
          <FaEnvelope className={styles.icon} /> mattransdooel@gmail.com
        </a>
      </p>
      <div className={styles.social}>
        <a
          href="https://www.facebook.com/MatTrans2022"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={facebook} alt="Facebook" />
        </a>
        <a
          href="https://www.instagram.com/mattrans1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={instagram} alt="Instagram" />
        </a>
        <a
          href="https://linkedin.com/mattrans"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={linkedin} alt="Linkedin" />
        </a>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <footer className={styles.footer}>
        <div className={styles.mobileWrapper}>
          <div className={styles.mobileTitle}>{t("contact")}</div>
          {renderContact()}
          <ul className={styles.simpleLinks}>
            <li>
              <a href="/terms">{t("terms.title")}</a>
            </li>
            <li>
              <a href="/privacy">{t("privacy.title")}</a>
            </li>
          </ul>
        </div>
        {showMap && (
          <MapPopup onClose={toggleMap}>
            <CompanyMap address="Маршал Тито 56, Берово, Македонија" />
          </MapPopup>
        )}
        <div className={styles.copyright}>{t("footer")}</div>
      </footer>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.topWrapper}>
        <div className={styles.sectionsWrapper}>
          <div className={styles.section}>
            <div className={styles.toggleTitle}>{t("infoTitle")}</div>
            <div className={styles.content}>
              <ul>
                <li>
                  <a href="/terms">{t("terms.title")}</a>
                </li>
                <li>
                  <a href="/privacy">{t("privacy.title")}</a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.toggleTitle}>{t("link")}</div>
            <div className={styles.content}>
              <ul>
                <li>
                  <button onClick={() => handleQuickLink("top")}>
                    {t("homeLink")}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleQuickLink("about")}>
                    {t("aboutUs")}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleQuickLink("booking")}>
                    {t("form")}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleQuickLink("faq")}>
                    {t("questions")}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleQuickLink("contact")}>
                    {t("contact")}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.toggleTitle}>{t("contact")}</div>
            <div className={styles.contentContact}>{renderContact()}</div>
          </div>
        </div>
      </div>

      {showMap && (
        <MapPopup onClose={toggleMap}>
          <CompanyMap address="Маршал Тито 56, Берово, Македонија" zoom={17} />
        </MapPopup>
      )}

      <div className={styles.copyright}>{t("footer")}</div>
    </footer>
  );
};

export default Footer;
