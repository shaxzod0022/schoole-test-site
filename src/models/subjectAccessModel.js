const mongoose = require("mongoose");

const subjectAccessSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  isAllowed: { type: Boolean, default: true }, // Fanga ruxsat berilgan yoki yo‘q
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SubjectAccess", subjectAccessSchema);
