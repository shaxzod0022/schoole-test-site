const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getAdminData = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Ruxsat yo‘q!" });
    }

    const admin = await Admin.findById(id).select("-password");

    if (!admin) return res.status(404).json({ message: "Admin topilmadi" });

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Xatolik yuz berdi", error });
  }
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Admin topilmadi!" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Noto‘g‘ri parol!" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token,
      admin: {
        _id: admin._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!" });
  }
};

exports.createAdmin = async (req, res) => {
  const {
    firstname,
    lastname,
    middlename,
    dateOfBirth,
    gender,
    phone,
    email,
    username,
    password,
    profile_image,
    position,
    subject,
    school_name,
    school_id,
    school_address,
    role,
  } = req.body;

  try {
    if (
      !firstname ||
      !lastname ||
      !phone ||
      !email ||
      !username ||
      !password ||
      !school_name
    ) {
      return res
        .status(400)
        .json({ message: "Barcha majburiy maydonlarni to‘ldiring!" });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Bu foydalanuvchi allaqachon mavjud!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      firstname,
      lastname,
      middlename,
      dateOfBirth,
      gender,
      phone,
      email,
      username,
      password: hashedPassword,
      profile_image,
      position,
      subject,
      school_name,
      school_id,
      school_address,
      role,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin muvaffaqiyatli yaratildi!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xatosi!" });
  }
};

exports.updateAdminProfile = async (req, res) => {
  const { id } = req.params; // Admin ID si
  const {
    firstname,
    lastname,
    phone,
    email,
    username,
    profile_image,
    dateOfBirth,
    gender,
    position,
    school_name,
    subject,
    school_address,
    middlename,
  } = req.body;

  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin topilmadi" });

    // Faqat ruxsat etilgan ma'lumotlarni o'zgartirish
    if (firstname) admin.firstname = firstname;
    if (lastname) admin.lastname = lastname;
    if (middlename) admin.middlename = middlename;
    if (phone) admin.phone = phone;
    if (email) admin.email = email;
    if (username) admin.username = username;
    if (profile_image) admin.profile_image = profile_image;
    if (dateOfBirth) admin.dateOfBirth = dateOfBirth;
    if (gender) admin.gender = gender;
    if (position) admin.position = position;
    if (subject) admin.subject = subject;
    if (school_name) admin.school_name = school_name;
    if (school_address) admin.school_address = school_address;

    admin.updatedAt = new Date();
    await admin.save();

    res.json({ message: "Ma’lumotlar yangilandi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi" });
  }
};

exports.updatePassword = async (req, res) => {
  const { id } = req.params;
  try {
    const { oldPass, newPass } = req.body;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin topilmadi!" });
    }

    const isMatch = await bcrypt.compare(oldPass, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Eski parol noto‘g‘ri!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Parol muvaffaqiyatli yangilandi!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xatosi!" });
  }
};
