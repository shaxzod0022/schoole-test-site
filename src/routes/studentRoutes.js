const express = require("express");
const {
  createStudent,
  getStudentsData,
  updateStudentData,
  deleteStudentData,
  loginStudent,
  updatePassword,
} = require("../controllers/studentController");
const verifyStudent = require("../middlewares/verifyStudent");

const router = express.Router();

router.post("/create", createStudent);
router.get("/students-data", getStudentsData);
router.put("/update-student-data/:id", updateStudentData);
router.delete("/delete-student/:id", deleteStudentData);
router.post("/login-student", loginStudent);
router.put("/update-password", verifyStudent, updatePassword);

module.exports = router;
