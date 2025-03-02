const express = require("express");
const {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

const router = express.Router();

router.post("/create-subject", createSubject);
router.get("/subjects-data", getSubjects);
router.put("/subject-update/:id", updateSubject);
router.delete("/subject-delete/:id", deleteSubject);

module.exports = router;
