const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
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
    console.log("Reservation request body:", req.body);

    const groupId = uuidv4();
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
      returnDate,
      returnDateUnknown,
      tripType,
    } = req.body;

    if (!fullName || !phone || !date || !from || !to || !adults) {
      return res
        .status(400)
        .json({ error: "Недостасуваат задолжителни полиња." });
    }

    if (tripType === "roundTrip" && !returnDate && !returnDateUnknown) {
      return res.status(400).json({
        error: "Недостасува повратен датум за двонасочна резервација.",
      });
    }

    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ error: "Невалиден формат на датум." });
    }

    if (
      returnDate &&
      returnDate !== "непознато" &&
      isNaN(Date.parse(returnDate))
    ) {
      return res
        .status(400)
        .json({ error: "Невалиден формат на повратен датум." });
    }

    const direction = from.toLowerCase().includes("берово")
      ? "berovo-skopje"
      : "skopje-berovo";

    const reservation = {
      fullName,
      phone,
      email: email || null,
      date,
      from,
      to,
      adults,
      children,
      status,
      direction,
      returnDate: returnDateUnknown ? null : returnDate,
      returnDateUnknown,
      tripType,
      groupId,
    };

    const saved = await create(reservation);
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating reservation:", err);
    res.status(500).json({ error: "Внатрешна грешка на серверот" });
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

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    if (
      req.body.direction &&
      !["berovo-skopje", "skopje-berovo"].includes(req.body.direction)
    ) {
      return res.status(400).json({ error: "Invalid direction value" });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedReservation) {
      return res
        .status(404)
        .json({ error: "Reservation not found after update" });
    }

    console.log("Ажурирана резервација:", updatedReservation);

    if (req.body.status === "confirmed") {
      const current = updatedReservation || reservation;

      const finalDirection = req.body.direction || current.direction;

      function reverseDirection(dir) {
        if (!dir) return null;
        const parts = dir.toLowerCase().trim().split("-");
        if (parts.length !== 2) return null;
        return `${parts[1]}-${parts[0]}`;
      }

      // Насока по потврда од админ

      const reverseDir = reverseDirection(finalDirection);
      await Reservation.findByIdAndUpdate(current._id, {
        direction: finalDirection,
      });
      // Ако има повратен пат, креираме повратна резервација со спротивна насока
      if (
        current.tripType === "roundTrip" &&
        current.returnDate &&
        !current.returnDateUnknown &&
        reverseDir
      ) {
        const existingReturnReservation = await Reservation.findOne({
          groupId: current.groupId,
          direction: reverseDir,
          date: current.returnDate,
        });

        if (!existingReturnReservation) {
          console.log(
            `Креирам повратна резервација со насока ${reverseDir} и датум ${current.returnDate}`
          );
          await Reservation.create({
            fullName: current.fullName,
            phone: current.phone,
            email: current.email,
            date: current.returnDate,
            from: current.to,
            to: current.from,
            adults: current.adults,
            children: current.children,
            status: "confirmed",
            direction: reverseDir,
            returnDate: null,
            returnDateUnknown: false,
            tripType: "oneWay",
            groupId: current.groupId,
          });
        }
      }
      if (current.email) {
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
      }
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

      await Reservation.findByIdAndDelete(id);

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
