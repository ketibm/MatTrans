// import React, { useState, useEffect } from "react";
// import Button from "../Button/Button";
// import styles from "./HeroSlider.module.css";
// import buttonStyles from "../Button/Button.module.css";
// import { useTranslation } from "react-i18next";

// const images = [
//   "/home/autoOne.jpg",
//   "/home/autoTwo.jpg",
//   "/home/autoThree.jpg",
//   "/home/autoFour.jpg",
// ];

// const HeroSlider = ({ bookingRef }) => {
//   const { t } = useTranslation();
//   const [currentImage, setCurrentImage] = useState(0);

//   const scrollToBooking = () => {
//     bookingRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImage((prev) => (prev + 1) % images.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className={styles.slider}>
//       <img
//         src={images[currentImage]}
//         alt={t("home.sliderAlt")}
//         className={styles.image}
//       />
//       <div className={styles.overlay}>
//         <div className={styles.textBox}>
//           <h1>{t("home.overlay.title")}</h1>
//           <h2>{t("home.overlay.subtitle")}</h2>
//           <div className={styles.buttons}>
//             <Button
//               className={`${buttonStyles.buttonLargeCommon} ${buttonStyles.buttonLarge}`}
//               onClick={scrollToBooking}
//             >
//               {t("home.overlay.bookBtn")}
//             </Button>

//             <Button
//               className={`${buttonStyles.buttonLargeCommon} ${buttonStyles.buttonCall}`}
//               onClick={() => (window.location.href = "tel:+38975309477")}
//             >
//               <span>{t("home.overlay.callBtn")}</span>
//               <span>075 309 477</span>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSlider;

import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import styles from "./HeroSlider.module.css";
import buttonStyles from "../Button/Button.module.css";
import { useTranslation } from "react-i18next";
import ImagePopup from "../ImagePopup/ImagePopup";

const images = [
  "/home/autoOne.jpg",
  "/home/autoTwo.jpg",
  "/home/autoThree.jpg",
  "/home/autoFour.jpg",
];

const HeroSlider = ({ bookingRef }) => {
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className={styles.slider}>
        <img
          src={images[currentImage]}
          alt={t("home.sliderAlt")}
          className={styles.image}
          onClick={() => setPopupOpen(true)}
        />
        <div className={styles.overlay}>
          <div className={styles.textBox}>
            <h1>{t("home.overlay.title")}</h1>
            <h2>{t("home.overlay.subtitle")}</h2>
            <div className={styles.buttons}>
              <Button
                className={`${buttonStyles.buttonLargeCommon} ${buttonStyles.buttonLarge}`}
                onClick={scrollToBooking}
              >
                {t("home.overlay.bookBtn")}
              </Button>
              <Button
                className={`${buttonStyles.buttonLargeCommon} ${buttonStyles.buttonCall}`}
                onClick={() => (window.location.href = "tel:+38975309477")}
              >
                <span>{t("home.overlay.callBtn")}</span>
                <span>075 309 477</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {popupOpen && (
        <ImagePopup
          images={images}
          startIndex={currentImage}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </>
  );
};

export default HeroSlider;
