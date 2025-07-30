import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import styles from "./ResetPasswordPage.module.css";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailFromUrl = searchParams.get("email") || "";

  const [form, setForm] = useState({
    email: emailFromUrl,
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Лозинките не се совпаѓаат!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          newPassword: form.newPassword,
          confirmNewPassword: form.confirmPassword,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || "Грешка при ресетирање на лозинка.");
        return;
      }

      setSuccess("Успешно ја сменивте лозинката!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError("Грешка при конекција со серверот.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Промена на лозинка</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          readOnly
          className={styles.input}
        />

        <div className={styles.passwordInputWrapper}>
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Нова лозинка"
            value={form.newPassword}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <span
            className={styles.eyeIcon}
            onClick={() => setShowNewPassword((v) => !v)}
          >
            {showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>

        <div className={styles.passwordInputWrapper}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Потврди нова лозинка"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <span
            className={styles.eyeIcon}
            onClick={() => setShowConfirmPassword((v) => !v)}
          >
            {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <Button type="submit" className={styles.submitButton}>
          Промени лозинка
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
