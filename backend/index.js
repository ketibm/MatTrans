require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");

const connectDB = require("./pkg/db");
const { receiveEmail } = require("./handlers/mailer");
const {
  createReservation,
  getOneReservation,
  getAllReservations,
  updateReservation,
  deleteReservation,
  deleteExpiredPending,
} = require("./handlers/reservation");
const {
  login,
  register,
  resetPassword,
  forgotPassword,
  refreshToken,
} = require("./handlers/auth");

const app = express();
connectDB();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: /\/api\/course\/[^/]+$/, methods: ["GET"] },
      "/api/reservations",
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/forgot-password",
      "/api/auth/reset-password",
      "/api/send-contact-mail",
    ],
  })
);

app.post("/api/auth/login", login);
app.get("/api/auth/refresh-token", refreshToken);
app.post("/api/auth/register", register);
app.post("/api/auth/reset-password", resetPassword);
app.post("/api/auth/forgot-password", forgotPassword);

app.get("/api/reservations", getAllReservations);
app.get("/api/reservations/:id", getOneReservation);
app.post("/api/reservations", createReservation);
app.patch("/api/reservations/:id", updateReservation);
app.delete("/api/reservations/:id", deleteReservation);
app.delete("/api/reservations/expired-pending", deleteExpiredPending);

app.post("/api/send-contact-mail", receiveEmail);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
