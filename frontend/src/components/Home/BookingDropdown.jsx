import React, { useState, useRef, useEffect } from "react";
import styles from "./BookingForm.module.css";
import { useTranslation } from "react-i18next";

const locations = {
  berovo: ["bus_station", "berovo_police_station"],
  smojmirovo: [],
  machevo: [],
  budinarci: [],
  mitrasinci: [],
  skopje: ["bus_station", "skopje_clinic", "skopje_student_home"],
  vinica: [],
  svetiNikole: [],
};

const sortedCities = Object.keys(locations).sort();

const BookingDropdown = ({ label, selected, onSelect }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeCity, setActiveCity] = useState(null);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setActiveCity(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMainClick = (city) => {
    if (locations[city].length === 0) {
      onSelect(t(`locations.${city}`));
      setOpen(false);
      setActiveCity(null);
    } else {
      setActiveCity(city);
    }
  };

  const handleSubLocationClick = (city, subLoc) => {
    onSelect(`${t(`locations.${city}`)} - ${t(`locations.${subLoc}`)}`);
    setOpen(false);
    setActiveCity(null);
  };

  const toggleDropdown = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) setActiveCity(null);
      return next;
    });
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <label>{label}</label>
      <div
        className={styles.dropdownInput}
        onClick={toggleDropdown}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            toggleDropdown();
          }
        }}
      >
        {selected || t("home.form.selectLocation")}
        <span className={styles.arrow}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className={styles.dropdownMenu}>
          {!activeCity &&
            sortedCities.map((city) => (
              <div key={city} className={styles.dropdownItem}>
                <button
                  type="button"
                  onClick={() => handleMainClick(city)}
                  className={styles.cityButton}
                >
                  {t(`locations.${city}`)}
                </button>
              </div>
            ))}

          {activeCity &&
            locations[activeCity].map((subLoc) => (
              <div key={subLoc} className={styles.dropdownSubItem}>
                <button
                  type="button"
                  onClick={() => handleSubLocationClick(activeCity, subLoc)}
                >
                  {t(`locations.${subLoc}`)}
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default BookingDropdown;
