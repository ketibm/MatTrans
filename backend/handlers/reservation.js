const mongoose = require("mongoose");
const { sendEmail } = require("./mailer");
const {
  Reservation,
  create,
  getAll,
  getById,
  update,
  deleteById,
  deleteExpiredPendingReservations,
} = require("../pkg/reservationCollections");

const createReservation = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      date,
      from,
      to,
      adults,
      children,
      status = "pending",
      direction,
    } = req.body;

    if (!fullName || !phone || !email || !date || !from || !to || !adults) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const savedReservation = await create({
      fullName,
      phone,
      email,
      date,
      from,
      to,
      adults,
      children,
      status,
      direction,
    });

    res.status(201).json(savedReservation);
  } catch (err) {
    console.error("Error creating reservation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOneReservation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid reservation ID" });
    }

    const reservation = await getById(id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (err) {
    console.error("Error fetching reservation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const reservations = await getAll();
    res.status(200).json(reservations);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid reservation ID" });
    }

    if (
      req.body.direction &&
      !["berovo-skopje", "skopje-berovo"].includes(req.body.direction)
    ) {
      return res.status(400).json({ error: "Invalid direction value" });
    }

    const updatedReservation = await update(id, req.body);

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    if (req.body.status === "confirmed") {
      const subject = "Вашата резервација е потврдена";
      const message = `Почитуван/а ${updatedReservation.fullName},

Ви благодариме што избравте да патувате со нас.
Вашата резервација е успешно потврдена.

Ви посакуваме среќен пат и Ви благодариме за довербата!

Со почит,
МАТ-ТРАНС`;

      await sendEmail({
        from: process.env.EMAIL_USER,
        to: updatedReservation.email,
        subject,
        text: message,
      });

      return res.status(200).json(updatedReservation);
    }

    if (req.body.status === "rejected") {
      const subject = "Вашата резервација е одбиена";
      const message = `Почитуван/а ${updatedReservation.fullName},

За жал, Вашата резервација е одбиена поради тоа што нема повеќе слободни места.

Ве молиме обидете се со резервација за друг датум.
Се извинуваме за непријатностите и Ви благодариме за разбирањето.

Со почит,
МАТ-ТРАНС`;

      await sendEmail({
        from: process.env.EMAIL_USER,
        to: updatedReservation.email,
        subject,
        text: message,
      });

      await deleteById(id);

      return res.status(200).json({
        message: "Reservation rejected and deleted, notification sent.",
      });
    }

    res.status(200).json(updatedReservation);
  } catch (err) {
    console.error("Error updating reservation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid reservation ID" });
    }

    const deletedReservation = await deleteById(id);

    if (!deletedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteExpiredPending = async (req, res) => {
  try {
    const result = await deleteExpiredPendingReservations();
    res.status(200).json({
      message: `${result.deletedCount} застарени резервации се избришани.`,
    });
  } catch (err) {
    console.error("Error deleting expired pending reservations:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createReservation,
  getOneReservation,
  getAllReservations,
  updateReservation,
  deleteReservation,
  deleteExpiredPending,
};
