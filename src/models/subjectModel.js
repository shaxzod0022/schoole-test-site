const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectname: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  duration: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Subject", subjectSchema);
