const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  date: {
    type: Date,
    required: true,
  },
  from: {
    type: String,
    required: true,
    trim: true,
  },
  to: {
    type: String,
    required: true,
    trim: true,
  },
  adults: {
    type: Number,
    required: true,
    min: 1,
  },

  children: {
    type: Number,
    required: false,
    min: 0,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending",
  },
  direction: {
    type: String,
    enum: ["berovo-skopje", "skopje-berovo", null],
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reservation = mongoose.model(
  "Reservation",
  reservationSchema,
  "reservations"
);

const create = async (data) => {
  const reservation = new Reservation(data);
  return await reservation.save();
};

const getAll = async () => {
  return await Reservation.find();
};

const getById = async (id) => {
  return await Reservation.findById(id);
};

const update = async (id, updateData) => {
  return await Reservation.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteById = async (id) => {
  return await Reservation.findByIdAndDelete(id);
};

const deleteExpiredPendingReservations = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await Reservation.deleteMany({
    status: "pending",
    date: { $lt: today },
  });

  return result;
};

module.exports = {
  Reservation,
  create,
  getAll,
  getById,
  update,
  deleteById,
  deleteExpiredPendingReservations,
};
