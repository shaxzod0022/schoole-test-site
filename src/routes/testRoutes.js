const express = require("express");
const {
  createTest,
  getTest,
  updateTest,
  deleteTest,
} = require("../controllers/testController");

const router = express.Router();

router.post("/create-test", createTest);
router.get("/tests-by-subject/:subjectId", getTest);
router.put("/update-test/:id", updateTest);
router.delete("/delete-test/:id", deleteTest);

module.exports = router;
