const express = require("express");
const {
  resultTest,
  getStudentResults,
} = require("../controllers/resultTestController");
const router = express.Router();

router.post("/submit-test", resultTest);
router.get("/student-results/:studentId", getStudentResults);

module.exports = router;