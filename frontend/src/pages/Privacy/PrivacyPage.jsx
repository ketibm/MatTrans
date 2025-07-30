import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./TermsPrivacyPage.module.css";

const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.title}>{t("privacy.title")}</h1>
      <div className={styles.content}>
        <p>{t("privacy.intro")}</p>

        <h2>{t("privacy.dataCollectionTitle")}</h2>
        <p>{t("privacy.dataCollectionContent")}</p>

        <h2>{t("privacy.cookiesTitle")}</h2>
        <p>{t("privacy.cookiesContent")}</p>

        <h2>{t("privacy.contactTitle")}</h2>
        <p>{t("privacy.contactContent")}</p>
      </div>
    </main>
  );
};

export default PrivacyPage;
