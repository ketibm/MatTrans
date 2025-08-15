import React, { useState, useEffect } from "react";
import styles from "./ModalCard.module.css";
import Button from "../Button/Button";

const ConfirmReservationModal = ({ reservation, onClose, onConfirm, show }) => {
  const [direction, setDirection] = useState(reservation?.direction || "");

  useEffect(() => {
    setDirection(reservation?.direction || "");
  }, [reservation]);

  if (!show || !reservation) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Потврдувам насока:",
      direction,
      "за резервација:",
      reservation._id
    );

    onConfirm({
      id: reservation._id,
      direction,
      returnDate: reservation.returnDate,
      tripType: reservation.tripType,
      returnDateUnknown: reservation.returnDateUnknown,
      groupId: reservation.groupId,
    });
    onClose();
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${date.getFullYear()}`;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Потврди резервација</h3>

        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <p>
            <strong>Име и презиме:</strong> {reservation.fullName}
          </p>
          <p>
            <strong>Патување:</strong> {reservation.from} → {reservation.to}
          </p>
          <p>
            <strong>Датум:</strong> {formatDate(reservation.date)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <label>
              <input
                type="radio"
                name="direction"
                value="berovo-skopje"
                checked={direction === "berovo-skopje"}
                onChange={() => setDirection("berovo-skopje")}
              />
              Берово → Скопје
            </label>

            <label style={{ marginLeft: "1.5rem" }}>
              <input
                type="radio"
                name="direction"
                value="skopje-berovo"
                checked={direction === "skopje-berovo"}
                onChange={() => setDirection("skopje-berovo")}
              />
              Скопје → Берово
            </label>
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <Button type="submit">Потврди</Button>

            <Button type="button" onClick={onClose} variant="secondary">
              Откажи
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmReservationModal;
