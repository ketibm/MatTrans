import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./TermsPrivacyPage.module.css";

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.title}>{t("terms.title")}</h1>
      <div className={styles.content}>
        <p>{t("terms.intro")}</p>

        <h2>{t("terms.userResponsibilitiesTitle")}</h2>
        <p>{t("terms.userResponsibilitiesContent")}</p>

        <h2>{t("terms.limitationOfLiabilityTitle")}</h2>
        <p>{t("terms.limitationOfLiabilityContent")}</p>

        <h2>{t("terms.changesTitle")}</h2>
        <p>{t("terms.changesContent")}</p>

        <h2>{t("terms.contactTitle")}</h2>
        <p>{t("terms.contactContent")}</p>
      </div>
    </main>
  );
};

export default TermsPage;
