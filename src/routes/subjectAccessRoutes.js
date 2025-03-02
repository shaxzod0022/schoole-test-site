const express = require("express");
const {
  allowSubjectAccess,
  blockSubjectAccess,
  checkSubjectAccess,
  getSubjectAccessByStudent,
} = require("../controllers/subjectAccessController");

const router = express.Router();

router.post("/allow-subject-access", allowSubjectAccess);
router.post("/block-subject-access", blockSubjectAccess);
router.get("/check-subject-access/:studentId/:subjectId", checkSubjectAccess);
router.get("/check-subject-all/:studentId", getSubjectAccessByStudent);

module.exports = router;
