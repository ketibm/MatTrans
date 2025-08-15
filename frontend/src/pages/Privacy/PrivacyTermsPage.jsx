import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./PrivacyTermsPage.module.css";

const PrivacyTermsPage = () => {
  const { t } = useTranslation();

  return (
    <main className={styles.mainContainer}>
      {/* Privacy Section */}
      <section className={styles.section}>
        <div className={styles.header}>
          <h1>{t("privacy.title")}</h1>
        </div>
        <div className={styles.content}>
          <p>{t("privacy.intro")}</p>

          <h2>{t("privacy.dataCollectionTitle")}</h2>
          <p>{t("privacy.dataCollectionContent")}</p>

          <h2>{t("privacy.protectionTitle")}</h2>
          <p>{t("privacy.protectionContent")}</p>

          <h2>{t("privacy.cookiesTitle")}</h2>
          <p>{t("privacy.cookiesContent")}</p>

          <h2>{t("privacy.contactTitle")}</h2>
          <p>{t("privacy.contactContent")}</p>
        </div>
      </section>

      {/* Terms Section */}
      <section className={styles.section}>
        <div className={styles.header}>
          <h1>{t("terms.title")}</h1>
        </div>
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
      </section>
    </main>
  );
};

export default PrivacyTermsPage;
