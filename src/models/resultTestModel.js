const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema({
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
  results: [
    {
      testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true,
      },
      question: { type: String, required: true },
      selectedOption: { type: String, required: true },
      correctAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TestResult", testResultSchema);
