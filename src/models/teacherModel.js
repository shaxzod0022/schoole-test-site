const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  middlename: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Erkak", "Ayol"] },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profile_image: { type: String },
  position: { type: String, default: "O'qituvchi" },
  subject: { type: String },
  school_name: { type: String, required: true },
  school_address: { type: String },
  role: {
    type: String,
    default: "o'qituvchi",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Teacher", teacherSchema);
