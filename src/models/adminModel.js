const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  middlename: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Erkak", "Ayol"] },
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hashlangan holda saqlanadi
  profile_image: { type: String },
  position: { type: String, default: "Direktor o‘rinbosari" },
  subject: { type: String }, // Agar fan o‘qitsa
  school_name: { type: String, required: true },
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
  school_address: { type: String },
  role: {
    type: String,
    enum: "admin",
    default: "admin",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", adminSchema);
