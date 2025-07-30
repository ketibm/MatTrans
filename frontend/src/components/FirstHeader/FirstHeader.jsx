import React from "react";
import { useTranslation } from "react-i18next";
import { FiPhone, FiMail } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import LogoutButton from "../Button/LogoutButton";
import styles from "./FirstHeader.module.css";

const FirstHeader = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname === "/admin";

  return (
    <div className={`${styles.firstHeader} ${isHomePage ? styles.fixed : ""}`}>
      <div className={styles.leftContact}>
        <div className={styles.contactItem}>
          <FiPhone className={styles.icons} />
          <a href="tel:+38975309477">+389 75 309 477</a>
        </div>
        <div className={styles.contactItem}>
          <FiMail className={styles.icons} />
          <a href="mailto:mattransdooel@gmail.com">mattransdooel@gmail.com</a>
        </div>
      </div>

      <div className={styles.languageSwitcher}>
        {isAdminPage ? <LogoutButton /> : <LanguageSwitcher />}
      </div>
    </div>
  );
};

export default FirstHeader;
