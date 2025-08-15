import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button/Button";

import styles from "./ModalCard.module.css";

const ModalCard = ({ show, message, closeModal }) => {
  const { t } = useTranslation();
  if (!show) return null;

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={closeModal}
          aria-label={t("close")}
        >
          &times;
        </button>

        {typeof message === "string" ? <p>{message}</p> : message}
        <Button
          className={styles.modalButton}
          type="button"
          onClick={closeModal}
        >
          {t("close")}
        </Button>
      </div>
    </div>
  );
};
export default ModalCard;
