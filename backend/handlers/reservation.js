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

    if (!fullName || !phone || !email || !date || !from || !to || !adults) {
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
      email,
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

    // if (req.body.status === "confirmed") {
    //   console.log(
    //     "Резервацијата е потврдена. Проверка за повратна резервација..."
    //   );

    //   const current = updatedReservation || reservation;
    //   console.log("Оригинална/Ажурирана резервација:", {
    //     direction: current?.direction,
    //     from: current?.from,
    //     to: current?.to,
    //     tripType: current?.tripType,
    //     returnDate: current?.returnDate,
    //     returnDateUnknown: current?.returnDateUnknown,
    //     groupId: current?.groupId,
    //   });

    //   let reverseDirection = null;
    //   const dir = (current?.direction || "").toLowerCase().trim();

    //   if (dir === "berovo-skopje") {
    //     reverseDirection = "skopje-berovo";
    //   } else if (dir === "skopje-berovo") {
    //     reverseDirection = "berovo-skopje";
    //   } else {
    //     const fromLower = (current?.from || "").toLowerCase();
    //     const toLower = (current?.to || "").toLowerCase();

    //     if (fromLower.includes("берово") && toLower.includes("скопје")) {
    //       reverseDirection = "skopje-berovo";
    //     } else if (fromLower.includes("скопје") && toLower.includes("берово")) {
    //       reverseDirection = "berovo-skopje";
    //     }
    //   }

    //   console.log("Пресметана reverseDirection =", reverseDirection);

    //   if (
    //     current?.tripType === "roundTrip" &&
    //     current?.returnDate &&
    //     !current?.returnDateUnknown &&
    //     reverseDirection
    //   ) {
    //     const existingReturnReservation = await Reservation.findOne({
    //       groupId: current.groupId,
    //       direction: reverseDirection,
    //       date: current.returnDate,
    //     });

    //     console.log(
    //       "Проба за постоечка повратна резервација:",
    //       existingReturnReservation
    //     );

    //     if (!existingReturnReservation) {
    //       const returnReservation = {
    //         fullName: current.fullName,
    //         phone: current.phone,
    //         email: current.email,
    //         date: current.returnDate,
    //         from: current.to,
    //         to: current.from,
    //         adults: current.adults,
    //         children: current.children,
    //         status: "confirmed",
    //         direction: reverseDirection,
    //         returnDate: null,
    //         returnDateUnknown: false,
    //         tripType: "oneWay",
    //         groupId: current.groupId,
    //       };

    //       console.log(
    //         "Креирање повратна резервација (payload):",
    //         returnReservation
    //       );

    //       try {
    //         const savedReturnReservation = await Reservation.create(
    //           returnReservation
    //         );
    //         console.log(
    //           "Повратна резервација успешно креирана:",
    //           savedReturnReservation
    //         );
    //       } catch (error) {
    //         console.error("Грешка при креирање повратна резервација:", error);
    //       }
    //     } else {
    //       console.log(
    //         "Повратна резервација веќе постои, нема да креирам дупликат."
    //       );
    //     }
    //   } else {
    //     console.log("Условите за повратна резервација не се исполнети.");
    //   }
    // if (req.body.status === "confirmed") {
    //   console.log(
    //     "Резервацијата е потврдена. Проверка за повратна резервација..."
    //   );

    //   const current = updatedReservation || reservation;
    //   console.log("Оригинална/Ажурирана резервација:", {
    //     direction: current?.direction,
    //     from: current?.from,
    //     to: current?.to,
    //     tripType: current?.tripType,
    //     returnDate: current?.returnDate,
    //     returnDateUnknown: current?.returnDateUnknown,
    //     groupId: current?.groupId,
    //   });

    //   // Функција за swap на direction (само два дела со -)
    //   function reverseDirection(dir) {
    //     if (!dir) return null;
    //     const parts = dir.toLowerCase().trim().split("-");
    //     if (parts.length !== 2) {
    //       console.log("Невалиден формат на direction:", dir);
    //       return null;
    //     }
    //     const reverseDir = parts.reverse().join("-");
    //     console.log(`reverseDirection('${dir}') -> '${reverseDir}'`);
    //     return reverseDir;
    //   }

    //   const direction = "skopje-berovo";
    //   const reverseDir = reverseDirection(direction);
    //   console.log("Пресметана reverseDirection =", reverseDir);

    //   // Проверка за повратна резервација
    //   if (
    //     current?.tripType === "roundTrip" &&
    //     current?.returnDate &&
    //     !current?.returnDateUnknown &&
    //     reverseDir
    //   ) {
    //     const existingReturnReservation = await Reservation.findOne({
    //       groupId: current.groupId,
    //       direction: reverseDir,
    //       date: current.returnDate,
    //     });

    //     console.log(
    //       "Проба за постоечка повратна резервација:",
    //       existingReturnReservation
    //     );

    //     if (!existingReturnReservation) {
    //       const returnReservation = {
    //         fullName: current.fullName,
    //         phone: current.phone,
    //         email: current.email,
    //         date: current.returnDate,
    //         from: current.to, // swap на from/to
    //         to: current.from,
    //         adults: current.adults,
    //         children: current.children,
    //         status: "confirmed",
    //         direction: reverseDir, // swap на direction
    //         returnDate: null,
    //         returnDateUnknown: false,
    //         tripType: "oneWay",
    //         groupId: current.groupId,
    //       };

    //       console.log(
    //         "Креирање повратна резервација (payload):",
    //         returnReservation
    //       );

    //       try {
    //         const savedReturnReservation = await Reservation.create(
    //           returnReservation
    //         );
    //         console.log(
    //           "Повратна резервација успешно креирана:",
    //           savedReturnReservation
    //         );
    //       } catch (error) {
    //         console.error("Грешка при креирање повратна резервација:", error);
    //       }
    //     } else {
    //       console.log(
    //         "Повратна резервација веќе постои, нема да креирам дупликат."
    //       );
    //     }
    //   } else {
    //     console.log("Условите за повратна резервација не се исполнети.");
    //   }
    if (req.body.status === "confirmed") {
      console.log("Direction од frontend:", req.body.direction);
      const current = updatedReservation || reservation;

      // function reverseDirection(dir) {
      //   if (!dir) return null;
      //   const normalized = dir.toLowerCase().trim();
      //   if (normalized === "berovo-skopje") return "skopje-berovo";
      //   if (normalized === "skopje-berovo") return "berovo-skopje";
      //   return null;
      // }
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

      // if (req.body.status === "confirmed") {
      //   const current = updatedReservation || reservation;

      //   function reverseDirection(dir) {
      //     if (!dir) return null;
      //     const parts = dir.toLowerCase().trim().split("-");
      //     if (parts.length !== 2) return null;
      //     return parts.reverse().join("-");
      //   }

      //   const reverseDir = reverseDirection(current.direction);

      //   // Ако е roundTrip, креирај повратна резервација, но не менувај ја насоката на оригиналната
      //   if (
      //     current.tripType === "roundTrip" &&
      //     current.returnDate &&
      //     !current.returnDateUnknown &&
      //     reverseDir
      //   ) {
      //     const existingReturnReservation = await Reservation.findOne({
      //       groupId: current.groupId,
      //       direction: reverseDir,
      //       date: current.returnDate,
      //     });

      //     if (!existingReturnReservation) {
      //       const returnReservation = {
      //         fullName: current.fullName,
      //         phone: current.phone,
      //         email: current.email,
      //         date: current.returnDate,
      //         from: current.to,
      //         to: current.from,
      //         adults: current.adults,
      //         children: current.children,
      //         status: "confirmed",
      //         direction: reverseDir, // оваа е спротивна насока
      //         returnDate: null,
      //         returnDateUnknown: false,
      //         tripType: "oneWay",
      //         groupId: current.groupId,
      //       };

      //       await Reservation.create(returnReservation);
      //     }
      //   }

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
