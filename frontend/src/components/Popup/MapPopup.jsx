import React from "react";
import styles from "./MapPopup.module.css";

const MapPopup = ({ onClose, children }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default MapPopup;
