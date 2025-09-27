import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import { FaGlobe } from "react-icons/fa";
import { createPortal } from "react-dom";
import styles from "./LanguageSwitcher.module.css";

const languages = [
  { code: "mk", lang: "mk", label: "MK" },
  { code: "gb", lang: "en", label: "EN" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [activeLang, setActiveLang] = useState(i18n.language || "mk");
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
      setActiveLang(savedLanguage);
    }
  }, [i18n]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setActiveLang(lang);
    setIsOpen(false);
  };

  const [coords, setCoords] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
  }, [isOpen]);

  const dropdown = (
    <div
      className={styles.dropdown}
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        transform: "translateX(-50%)",
      }}
    >
      {languages.map(({ code, lang }) => (
        <div
          key={code}
          className={styles.dropdownItem}
          onClick={() => handleLanguageChange(lang)}
        >
          <Flag code={code} className={styles.dropdownFlag} />
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.languageSwitcher}>
      <button
        ref={buttonRef}
        className={styles.iconWrapper}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
      >
        <FaGlobe className={styles.globeIcon} />
      </button>

      {isOpen && createPortal(dropdown, document.body)}
    </div>
  );
};

export default LanguageSwitcher;
