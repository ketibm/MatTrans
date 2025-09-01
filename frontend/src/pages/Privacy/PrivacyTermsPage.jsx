import React from "react";
import { useTranslation } from "react-i18next";
import Seo from "../../components/Seo/Seo";
import styles from "./PrivacyTermsPage.module.css";

const PrivacyTermsPage = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Seo
        title={
          i18n.language === "mk"
            ? "МАТ-ТРАНС | Политика за приватност и Услови за користење"
            : "MAT-TRANS | Privacy Policy and Terms of Use"
        }
        description={
          i18n.language === "mk"
            ? "Прочитајте ги политиките за приватност и условите за користење на МАТ-ТРАНС. Дознајте како ги заштитуваме вашите податоци и кои се вашите права и обврски."
            : "Read MAT-TRANS privacy policy and terms of use. Learn how we protect your personal data and what your rights and responsibilities are as a user."
        }
        lang={i18n.language}
      />

      <main className={styles.mainContainer}>
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
    </>
  );
};

export default PrivacyTermsPage;
