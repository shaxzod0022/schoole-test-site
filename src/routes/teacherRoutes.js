const express = require("express");
const {
  createTeachers,
  getTeacherData,
  updateTeacherData,
  deleteTeacher,
  loginTeacher,
  updateTeacherPassword,
} = require("../controllers/teacherController");
const verifyAdmin = require("../middlewares/verifyToken");
const verifyTeacher = require("../middlewares/verifyTeacher");

const router = express.Router();

router.post("/create", verifyAdmin, createTeachers);
router.delete("/delete-teacher/:id", verifyAdmin, deleteTeacher);
router.post("/login-teacher", loginTeacher);
router.get("/teacher-data", getTeacherData);
router.put("/update-teacher-data/:id", updateTeacherData);
router.put("/update-password/:id", verifyTeacher, updateTeacherPassword);

module.exports = router;
