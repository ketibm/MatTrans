import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import ModalCard from "../../components/Modal/ModalCard";
import styles from "./AdminAuthPage.module.css";

const AdminAuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalMessage("");
    setModalType("");
  };

  const showModal = (message, type = "") => {
    setModalMessage(message);
    setModalVisible(true);
    setModalType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let url = "";
      let body = {};

      if (mode === "login") {
        url = "http://localhost:5000/api/auth/login";
        body = { email: form.email, password: form.password };
      } else if (mode === "register") {
        url = "http://localhost:5000/api/auth/register";
        body = {
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          fullName: form.fullName,
        };
      } else if (mode === "forgot") {
        url = "http://localhost:5000/api/auth/forgot-password";
        body = { email: form.email };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();

        if (
          mode === "login" &&
          (text.toLowerCase().includes("not found") ||
            text.toLowerCase().includes("account not found") ||
            text.toLowerCase().includes("нема") ||
            text.toLowerCase().includes("не постои"))
        ) {
          showModal(
            "Сметката не постои. Ве молиме регистрирајте се.",
            "accountMissing"
          );
          setError("");
          return;
        }

        throw new Error(text || "Грешка при барањето");
      }

      if (mode === "login") {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        navigate("/admin");
      } else if (mode === "register") {
        showModal("Успешна регистрација! Може да се најавите сега.", "success");
        setMode("login");
        setForm({ email: "", password: "", confirmPassword: "", fullName: "" });
      } else if (mode === "forgot") {
        showModal("Испратен е e-mail за промена на лозинка.", "success");
        setForm({ email: "", password: "", confirmPassword: "", fullName: "" });
      }
    } catch (err) {
      showModal(err.message || "Грешка при барањето");
    }
  };

  return (
    <div className={styles.container}>
      <h2>
        {mode === "login"
          ? "Најави се"
          : mode === "register"
          ? "Регистрирај се"
          : "Промена на лозинка"}
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === "register" && (
          <input
            type="text"
            placeholder="Име и Презиме"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        {(mode === "login" || mode === "register") && (
          <input
            type="password"
            placeholder="Лозинка"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
        )}

        {mode === "register" && (
          <input
            type="password"
            placeholder="Потврди лозинка"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        )}

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <Button type="submit" className={styles.submitButton}>
          {mode === "login"
            ? "Најави се"
            : mode === "register"
            ? "Регистрирај се"
            : "Испрати"}
        </Button>

        <div className={styles.links}>
          {mode !== "login" && (
            <p
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
                setForm({
                  email: "",
                  password: "",
                  confirmPassword: "",
                  fullName: "",
                });
              }}
              className={styles.link}
            >
              Најави се
            </p>
          )}
          {mode !== "register" && (
            <p
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
                setForm({
                  email: "",
                  password: "",
                  confirmPassword: "",
                  fullName: "",
                });
              }}
              className={styles.link}
            >
              Регистрирај се
            </p>
          )}
          {mode !== "forgot" && (
            <p
              onClick={() => {
                setMode("forgot");
                setError("");
                setSuccess("");
                setForm({
                  email: "",
                  password: "",
                  confirmPassword: "",
                  fullName: "",
                });
              }}
              className={styles.link}
            >
              Ја заборавивте лозинката?
            </p>
          )}
        </div>
      </form>

      <ModalCard
        show={modalVisible}
        message={modalMessage}
        closeModal={closeModal}
      >
        {modalType === "accountMissing" && (
          <Button
            onClick={() => {
              setMode("register");
              closeModal();
              setForm({
                email: "",
                password: "",
                confirmPassword: "",
                fullName: "",
              });
            }}
          >
            Регистрирај се
          </Button>
        )}
      </ModalCard>
    </div>
  );
};

export default AdminAuthPage;
