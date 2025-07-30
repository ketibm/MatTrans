import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./HomePage.module.css";
import HeroSlider from "../../components/Home/HeroSlider";
import AboutSection from "../../components/Home/AboutSection";
import BookingForm from "../../components/Home/BookingForm";
import FAQSection from "../../components/Home/FAQSection";
import ModalCard from "../../components/Modal/ModalCard";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const { topRef, aboutRef, bookingRef, faqRef } = useOutletContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addReservation = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Грешка при додавање на резервацијата");
      }

      const savedReservation = await response.json();

      const messageText = `
          Добивте ново барање за резервација.
         За да ги видите деталите и да ја потврдите или одбиете резервацијата, кликнете на следниот линк:
         https://localhost5173/login
         `;

      const emailData = {
        name: formData.fullName,
        email: formData.email,
        message: messageText,
      };

      await fetch("http://localhost:5000/api/send-contact-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      setFormData({
        ...savedReservation,
        fullNameOriginal: formData.fullNameOriginal,
        fromOriginal: formData.fromOriginal,
        toOriginal: formData.toOriginal,
      });
      setModalOpen(true);
    } catch (error) {
      console.error("Грешка при додавање или праќање мејл:", error);
    }
  };

  const modalMessageMobile = (
    <>
      <h3 id="modal-title">{t("home.modal.confirmationTitle")}</h3>
      <p className={styles.modalNote}>{t("home.modal.followUpNote")}</p>
    </>
  );

  const modalMessageDesktop = (
    <>
      <h3 id="modal-title">{t("home.modal.confirmationTitle")}</h3>

      <div className={styles.modalDetails}>
        <p>
          <strong>{t("home.form.name")}:</strong>{" "}
          {i18n.language === "mk"
            ? formData.fullName
            : formData.fullNameOriginal || formData.fullName}
        </p>
        <p>
          <strong>{t("home.form.phone")}:</strong> {formData.phone}
        </p>
        <p>
          <strong>{t("home.form.email")}:</strong> {formData.email}
        </p>
        <p>
          <strong>{t("home.form.date")}:</strong> {formData.date}
        </p>
        <p>
          <strong>{t("home.form.from")}:</strong>{" "}
          {i18n.language === "mk" ? formData.from : formData.fromOriginal}
        </p>
        <p>
          <strong>{t("home.form.to")}:</strong>{" "}
          {i18n.language === "mk" ? formData.to : formData.toOriginal}
        </p>

        <p>
          <strong>{t("home.form.adults")}:</strong> {formData.adults}
        </p>
        <p>
          <strong>{t("home.form.children")}:</strong> {formData.children}
        </p>

        {formData.tripType === "roundTrip" && (
          <p>
            <strong>{t("home.form.returnDate")}:</strong>{" "}
            {formData.returnDate || t("home.modal.unknownDate")}
          </p>
        )}
      </div>

      <p className={styles.modalNote}>{t("home.modal.followUpNote")}</p>
    </>
  );

  return (
    <div className={styles.container} ref={topRef}>
      <HeroSlider bookingRef={bookingRef} />
      <div ref={aboutRef}>
        <AboutSection />
      </div>
      <div ref={bookingRef}>
        <BookingForm
          bookingRef={bookingRef}
          submitButtonText={t("home.form.submit")}
          setFormData={setFormData}
          setModalOpen={setModalOpen}
          onSubmitCallback={addReservation}
          title="home.bookingTitle"
        />
      </div>
      <div ref={faqRef}>
        <FAQSection />
      </div>

      <ModalCard
        show={modalOpen}
        message={isMobile ? modalMessageMobile : modalMessageDesktop}
        closeModal={() => setModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
