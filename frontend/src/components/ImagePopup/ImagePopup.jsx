// import React, { useState, useEffect, useRef } from "react";
// import styles from "./ImagePopup.module.css";

// const ImagePopup = ({ images, startIndex, onClose }) => {
//   const [index, setIndex] = useState(startIndex);

//   const touchStartX = useRef(0);
//   const touchEndX = useRef(0);

//   const prevImage = () =>
//     setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   const nextImage = () => setIndex((prev) => (prev + 1) % images.length);

//   const handleTouchStart = (e) => {
//     if (window.innerWidth <= 768) {
//       touchStartX.current = e.changedTouches[0].screenX;
//     }
//   };

//   const handleTouchEnd = (e) => {
//     if (window.innerWidth <= 768) {
//       touchEndX.current = e.changedTouches[0].screenX;
//       handleSwipe();
//     }
//   };

//   const handleSwipe = () => {
//     const diff = touchStartX.current - touchEndX.current;
//     if (Math.abs(diff) > 50) {
//       if (diff > 0) {
//         nextImage();
//       } else {
//         prevImage();
//       }
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") onClose();
//       if (e.key === "ArrowLeft") prevImage();
//       if (e.key === "ArrowRight") nextImage();
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   return (
//     <div
//       className={styles.popup}
//       onClick={onClose}
//       onTouchStart={handleTouchStart}
//       onTouchEnd={handleTouchEnd}
//     >
//       <span className={styles.close} onClick={onClose}>
//         ✕
//       </span>

//       <div onClick={(e) => e.stopPropagation()}>
//         <button className={styles.arrowLeft} onClick={prevImage}>
//           ‹
//         </button>
//         <img src={images[index]} alt="popup" className={styles.mainImage} />
//         <button className={styles.arrowRight} onClick={nextImage}>
//           ›
//         </button>

//         <div className={styles.thumbnails}>
//           {images.map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               alt="thumb"
//               className={`${styles.thumb} ${i === index ? styles.active : ""}`}
//               onClick={() => setIndex(i)}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImagePopup;
// import React, { useState, useEffect, useRef } from "react";
// import styles from "./ImagePopup.module.css";

// const ImagePopup = ({ images, startIndex, onClose }) => {
//   const [index, setIndex] = useState(startIndex);

//   const touchStartX = useRef(0);
//   const touchEndX = useRef(0);

//   const prevImage = () =>
//     setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   const nextImage = () => setIndex((prev) => (prev + 1) % images.length);

//   const handleTouchStart = (e) => {
//     if (window.innerWidth <= 768) {
//       touchStartX.current = e.changedTouches[0].screenX;
//     }
//   };

//   // за мобилен - крај на touch
//   const handleTouchEnd = (e) => {
//     if (window.innerWidth <= 768) {
//       touchEndX.current = e.changedTouches[0].screenX;
//       handleSwipe();
//     }
//   };

//   const handleSwipe = () => {
//     const diff = touchStartX.current - touchEndX.current;
//     if (Math.abs(diff) > 50) {
//       if (diff > 0) nextImage();
//       else prevImage();
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") onClose();
//       if (e.key === "ArrowLeft") prevImage();
//       if (e.key === "ArrowRight") nextImage();
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   return (
//     <div
//       className={styles.popup}
//       onClick={onClose}
//       onTouchStart={handleTouchStart}
//       onTouchEnd={handleTouchEnd}
//     >
//       <span className={styles.close} onClick={onClose}>
//         ✕
//       </span>

//       <div className={styles.mainWrapper} onClick={(e) => e.stopPropagation()}>
//         <button className={styles.arrowLeft} onClick={prevImage}>
//           ‹
//         </button>
//         <img src={images[index]} alt="popup" className={styles.mainImage} />
//         <button className={styles.arrowRight} onClick={nextImage}>
//           ›
//         </button>
//       </div>

//       <div className={styles.thumbnails}>
//         {images.map((img, i) => (
//           <img
//             key={i}
//             src={img}
//             alt="thumb"
//             className={`${styles.thumb} ${i === index ? styles.active : ""}`}
//             onClick={(e) => {
//               e.stopPropagation();
//               setIndex(i);
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImagePopup;
import React, { useState, useEffect, useRef } from "react";
import styles from "./ImagePopup.module.css";

const ImagePopup = ({ images, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const prevImage = () =>
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setIndex((prev) => (prev + 1) % images.length);

  // мобилен – почеток на swipe
  const handleTouchStart = (e) => {
    if (window.innerWidth <= 768) {
      touchStartX.current = e.changedTouches[0].screenX;
    }
  };

  // мобилен – крај на swipe
  const handleTouchEnd = (e) => {
    if (window.innerWidth <= 768) {
      touchEndX.current = e.changedTouches[0].screenX;
      handleSwipe();
    }
  };

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage(); // swipe left
      else prevImage(); // swipe right
    }
  };

  // desktop – навигација со тастатура
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);

    // 🚫 стопирање на scroll на body кога е отворен popup
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className={styles.popup}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <span className={styles.close} onClick={onClose}>
        ✕
      </span>

      <div className={styles.mainWrapper} onClick={(e) => e.stopPropagation()}>
        {/* стрелки само на desktop */}
        <button className={styles.arrowLeft} onClick={prevImage}>
          ‹
        </button>
        <img src={images[index]} alt="popup" className={styles.mainImage} />
        <button className={styles.arrowRight} onClick={nextImage}>
          ›
        </button>
      </div>

      <div className={styles.thumbnails} onClick={(e) => e.stopPropagation()}>
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
  );
};

export default ImagePopup;
