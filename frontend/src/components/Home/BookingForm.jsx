import React, { useState } from "react";
import styles from "./BookingForm.module.css";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import BookingDropdown from "./BookingDropdown";

const getValidMinDate = () => {
  const now = new Date();
  const hour = now.getHours();

  if (hour < 15) {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const transliterateLatinToCyrillic = (text) => {
  const map = {
    A: "А",
    B: "Б",
    C: "Ц",
    Č: "Ч",
    Ć: "Ќ",
    D: "Д",
    Dž: "Џ",
    Đ: "Ѓ",
    E: "Е",
    F: "Ф",
    G: "Г",
    H: "Х",
    I: "И",
    J: "Ј",
    K: "К",
    L: "Л",
    Lj: "Љ",
    M: "М",
    N: "Н",
    Nj: "Њ",
    O: "О",
    P: "П",
    R: "Р",
    S: "С",
    Š: "Ш",
    T: "Т",
    U: "У",
    V: "В",
    Z: "З",
    Ž: "Ж",
    a: "а",
    b: "б",
    c: "ц",
    č: "ч",
    ć: "ќ",
    d: "д",
    dž: "џ",
    đ: "ѓ",
    e: "е",
    f: "ф",
    g: "г",
    h: "х",
    i: "и",
    j: "ј",
    k: "к",
    l: "л",
    lj: "љ",
    m: "м",
    n: "н",
    nj: "њ",
    o: "о",
    p: "п",
    r: "р",
    s: "с",
    š: "ш",
    t: "т",
    u: "у",
    v: "в",
    z: "з",
    ž: "ж",
  };

  const multiCharMap = {
    Dž: "Џ",
    dž: "џ",
    Lj: "Љ",
    lj: "љ",
    Nj: "Њ",
    nj: "њ",
    Kj: "Ќ",
    kj: "ќ",
    Gj: "Ѓ",
    gj: "ѓ",
    Ch: "Ч",
    ch: "ч",
    Sh: "Ш",
    sh: "ш",
  };

  let result = text;
  for (const [latin, cyrillic] of Object.entries(multiCharMap)) {
    result = result.replaceAll(latin, cyrillic);
  }
  result = result
    .split("")
    .map((char) => map[char] || char)
    .join("");
  return result;
};

const capitalizeEachWord = (text) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const BookingForm = ({
  bookingRef,
  submitButtonText = "Резервирај",
  onSubmitCallback,
  title,
}) => {
  const { t } = useTranslation();
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const [tripType, setTripType] = useState("oneWay");
  const [returnDateUnknown, setReturnDateUnknown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const adults = parseInt(e.target.adults.value) || 0;
    const children = parseInt(e.target.children.value) || 0;

    const fullNameInput = capitalizeEachWord(e.target.fullName.value);

    const formData = {
      fullName: transliterateLatinToCyrillic(fullNameInput),
      fullNameOriginal: fullNameInput,
      phone: e.target.phone.value,
      email: e.target.email.value,
      date: e.target.date.value,
      from: transliterateLatinToCyrillic(selectedFrom),
      to: transliterateLatinToCyrillic(selectedTo),
      fromOriginal: selectedFrom,
      toOriginal: selectedTo,
      adults,
      children,
      tripType,
      returnDate: returnDateUnknown ? null : e.target.returnDate?.value,
      returnDateUnknown,
    };

    try {
      setLoading(true);
      if (onSubmitCallback) {
        await onSubmitCallback(formData);
      }

      e.target.reset();
      setSelectedFrom("");
      setSelectedTo("");
      setTripType("oneWay");
      setReturnDateUnknown(false);
      setMessage("");
    } catch (err) {
      console.error("Грешка при испраќање:", err);
      setMessage(t("home.form.emailSendFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.booking} ref={bookingRef}>
      <div className={styles.radioGroupLine}>
        <h3>{t(title || "home.bookingTitle")}</h3>

        <div className={styles.radioGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="tripType"
              value="oneWay"
              checked={tripType === "oneWay"}
              onChange={() => setTripType("oneWay")}
            />
            {t("home.form.oneWay")}
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="tripType"
              value="roundTrip"
              checked={tripType === "roundTrip"}
              onChange={() => setTripType("roundTrip")}
            />
            {t("home.form.roundTrip")}
          </label>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          {t("home.form.name")}
          <input type="text" name="fullName" required />
        </label>

        <label>
          {t("home.form.phone")}
          <input type="tel" name="phone" required />
        </label>

        <label>
          {t("home.form.email")}
          <input type="email" name="email" required />
        </label>

        <div className={styles.narrowLabel}>
          <label>{t("home.form.people")}</label>
          <div className={styles.passengerInputs}>
            <input
              type="number"
              name="adults"
              placeholder={t("home.form.adults") || "Возрасни"}
              min="0"
              required
            />
            <input
              type="number"
              name="children"
              placeholder={t("home.form.children") || "Деца"}
              min="0"
            />
          </div>
        </div>

        <BookingDropdown
          label={t("home.form.from")}
          selected={selectedFrom}
          onSelect={setSelectedFrom}
        />

        <BookingDropdown
          label={t("home.form.to")}
          selected={selectedTo}
          onSelect={setSelectedTo}
        />

        <label>
          {t("home.form.date")}
          <input type="date" name="date" min={getValidMinDate()} required />
        </label>

        {tripType === "roundTrip" && (
          <>
            <label>
              {t("home.form.returnDate")}
              <input
                type="date"
                name="returnDate"
                min={getValidMinDate()}
                disabled={returnDateUnknown}
                required={!returnDateUnknown}
              />
            </label>

            <div className={styles.returnOptionsRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={returnDateUnknown}
                  onChange={(e) => setReturnDateUnknown(e.target.checked)}
                />
                {t("home.form.returnDateUnknown")}
              </label>
            </div>
          </>
        )}

        <Button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading
            ? t("home.form.submit") || "Се испраќа..."
            : submitButtonText}
        </Button>

        {message && <p className={styles.errorMessage}>{message}</p>}
      </form>
    </section>
  );
};

export default BookingForm;
