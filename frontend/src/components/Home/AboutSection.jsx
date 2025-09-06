import React, { useState, useEffect, useRef } from "react";
import {
  MdDirectionsCar,
  MdEventAvailable,
  MdSupportAgent,
  MdSecurity,
  MdPeople,
  MdVerifiedUser,
} from "react-icons/md";
import styles from "./AboutSection.module.css";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation();

  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);

  const aboutRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setLeftVisible(true);
            setTimeout(() => setRightVisible(true), 1200);

            hasAnimated.current = true;
            obs.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (aboutRef.current) observer.observe(aboutRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.about} ref={aboutRef}>
      <h2>{t("home.aboutTitle")}</h2>
      <div className={styles.aboutContent}>
        <div
          className={`${styles.aboutText} ${
            leftVisible ? styles.leftAnimate : ""
          }`}
        >
          <p>
            <strong>{t("home.aboutSections.regularTransport.company")}</strong>{" "}
            {t("home.aboutDescription")}
          </p>
          <h3>{t("home.aboutSections.regularTransport.title")}</h3>
          <p>
            <strong>{t("home.aboutSections.regularTransport.company")}</strong>{" "}
            {t("home.aboutSections.regularTransport.text")
              .split("\n")
              .map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
          </p>
          <p className={styles.schedule}>
            {t("home.schedule.berovo")}: 07:00 <br />
            {t("home.schedule.skopje")}: 16:00
          </p>

          <h3>{t("home.aboutSections.additionalServices.title")}</h3>

          <p>{t("home.aboutSections.additionalServices.footerText")}</p>

          <p>{t("home.aboutSections.additionalServices.intro")}</p>

          <ul>
            <li>{t("home.aboutSections.additionalServices.weddings")}</li>
            <li>
              {t("home.aboutSections.additionalServices.airportTransport")}
            </li>
            <li>{t("home.aboutSections.additionalServices.groupTransport")}</li>
          </ul>
        </div>

        <div
          className={`${styles.featuresList} ${
            rightVisible ? styles.rightAnimate : ""
          }`}
        >
          <div className={styles.featuresColumn}>
            <div className={styles.featureRow}>
              <MdDirectionsCar className={styles.iconLeft} />
              <span>{t("home.features.reliableTransport.title")}</span>
            </div>

            <div className={styles.featureRow}>
              <MdEventAvailable className={styles.iconLeft} />
              <span>{t("home.features.bookingFlexibility.title")}</span>
            </div>

            <div className={styles.featureRow}>
              <MdSupportAgent className={styles.iconLeft} />
              <span>{t("home.features.customerService.title")}</span>
            </div>
          </div>
          <div className={styles.featuresColumn}>
            <div className={styles.featureRow}>
              <MdVerifiedUser className={styles.iconLeft} />
              <span>{t("home.features.qualityVehicles.title")}</span>
            </div>

            <div className={styles.featureRow}>
              <MdSecurity className={styles.iconLeft} />
              <span>{t("home.features.safetyGuarantee.title")}</span>
            </div>

            <div className={styles.featureRow}>
              <MdPeople className={styles.iconLeft} />
              <span>{t("home.features.professionalStaff.title")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
