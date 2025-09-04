import React, { useState, useEffect } from "react";
import styles from "./ImagePopup.module.css";

const ImagePopup = ({ images, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);

  const prevImage = () =>
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={styles.popup} onClick={onClose}>
      <span className={styles.close} onClick={onClose}>
        ✕
      </span>
      <div onClick={(e) => e.stopPropagation()}>
        <button className={styles.arrowLeft} onClick={prevImage}>
          ‹
        </button>
        <img src={images[index]} alt="popup" className={styles.mainImage} />
        <button className={styles.arrowRight} onClick={nextImage}>
          ›
        </button>
        <div className={styles.thumbnails}>
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="thumb"
              className={`${styles.thumb} ${i === index ? styles.active : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
