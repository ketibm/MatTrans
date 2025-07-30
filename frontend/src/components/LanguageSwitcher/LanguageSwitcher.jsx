import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import { FaGlobe } from "react-icons/fa";
import styles from "./LanguageSwitcher.module.css";

const languages = [
  { code: "mk", lang: "mk", label: "MK" },
  { code: "gb", lang: "en", label: "EN" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [activeLang, setActiveLang] = useState(i18n.language || "mk");
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={styles.iconWrapper}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
      >
        <FaGlobe className={styles.globeIcon} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map(({ code, lang, label }) => (
            <div
              key={code}
              className={styles.dropdownItem}
              onClick={() => handleLanguageChange(lang)}
            >
              <Flag code={code} className={styles.dropdownFlag} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
