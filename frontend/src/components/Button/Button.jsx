import React from "react";
import styles from "./Button.module.css";

const Button = ({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
