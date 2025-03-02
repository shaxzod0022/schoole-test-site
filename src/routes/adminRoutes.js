const express = require("express");
const {
  adminLogin,
  updateAdminProfile,
  createAdmin,
  updatePassword,
  getAdminData,
} = require("../controllers/adminController");
const verifyAdmin = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/login", adminLogin);
router.post("/create", createAdmin);
router.get("/admin-data/:id", verifyAdmin, getAdminData);
router.put("/update-admin-profile/:id", verifyAdmin, updateAdminProfile);
router.put("/update-password/:id", verifyAdmin, updatePassword);

module.exports = router;
