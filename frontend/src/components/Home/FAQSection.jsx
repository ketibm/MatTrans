import React, { useState, useEffect, useRef } from "react";
import styles from "./FAQSection.module.css";
import InfoImg from "../../assets/info.jpg";
import LogoImg from "../../assets/logo.jpg";
import { useTranslation } from "react-i18next";

const FAQSection = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);

  const faqSectionRef = useRef(null);
  const hasAnimated = useRef(false);

  const triggerAnimation = () => {
    setLeftVisible(false);
    setRightVisible(false);

    setTimeout(() => {
      setLeftVisible(true);
      setTimeout(() => setRightVisible(true), 1200);
    }, 50);
  };

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

    if (faqSectionRef.current) observer.observe(faqSectionRef.current);

    return () => observer.disconnect();
  }, []);

  const faqs = [1, 2, 3, 4, 5];

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection} ref={faqSectionRef}>
      <div
        className={`${styles.leftImage} ${
          leftVisible ? styles.leftAnimate : ""
        }`}
      >
        <img src={InfoImg} alt="Info" />
      </div>

      <div
        className={`${styles.rightPanel} ${
          rightVisible ? styles.rightAnimate : ""
        }`}
      >
        <img
          src={LogoImg}
          alt="Logo background"
          className={`${styles.logoImg} ${
            rightVisible ? styles.logoAnimate : ""
          }`}
        />

        <div
          className={`${styles.faqContainer} ${
            rightVisible ? styles.panelAnimate : ""
          }`}
        >
          <h2 className={styles.faqTitle}>{t("faq.title")}</h2>
          {faqs.map((i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`${styles.faqItem} ${isOpen ? styles.open : ""}`}
                onClick={() => toggleOpen(i)}
              >
                <div className={styles.question}>
                  <h4 className={styles.questionText}>{t(`faq.q${i}`)}</h4>
                  <span
                    className={`${styles.triangle} ${
                      isOpen ? styles.rotate : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>

                {isOpen && (
                  <>
                    <div className={styles.answer}>
                      <p>{t(`faq.a${i}`)}</p>
                    </div>
                    <div className={styles.line}></div>
                  </>
                )}
                {!isOpen && <div className={styles.line}></div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
