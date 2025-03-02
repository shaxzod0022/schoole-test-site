const Teacher = require("../models/teacherModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginTeacher = async (req, res) => {
  const { username, password } = req.body;
  try {
    const teacher = await Teacher.findOne({ username });
    if (!teacher)
      return res.status(400).json({ message: "Foydalanuvchi topilmadi!" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ message: "Parol xato!" });

    const token = jwt.sign({ id: teacher._id, role: "teacher" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, teacher: { _id: teacher._id } });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!", error });
  }
};

exports.createTeachers = async (req, res) => {
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
    school_address,
    role,
    school_id,
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

    const existingTeacher = await Teacher.findOne({ username });
    if (existingTeacher) {
      return res
        .status(400)
        .json({ message: "Bu foydalanuvchi allaqachon mavjud!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newTeacher = new Teacher({
      firstname,
      lastname,
      middlename: middlename || "",
      dateOfBirth: dateOfBirth || null,
      gender,
      phone,
      email,
      username,
      password: hashedPassword,
      profile_image: profile_image || "",
      position,
      subject,
      school_name,
      school_id: school_id || null,
      school_address,
      role: role || "teacher",
    });

    await newTeacher.save();

    return res.status(201).json({
      message: "O'qituvchi muvaffaqiyatli qo'shildi!",
      teacher: newTeacher, // Yangi yaratilgan foydalanuvchi ma’lumotlari qaytariladi
    });
  } catch (error) {
    console.error("Xatolik:", error);
    return res
      .status(500)
      .json({ message: "Server xatosi!", error: error.message });
  }
};

exports.updateTeacherData = async (req, res) => {
  const { id } = req.params;
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
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "O'qituvchi topilmadi!" });
    }

    if (firstname) teacher.firstname = firstname;
    if (lastname) teacher.lastname = lastname;
    if (middlename) teacher.middlename = middlename;
    if (phone) teacher.phone = phone;
    if (email) teacher.email = email;
    if (username) teacher.username = username;
    if (profile_image) teacher.profile_image = profile_image;
    if (dateOfBirth) teacher.dateOfBirth = dateOfBirth;
    if (gender) teacher.gender = gender;
    if (position) teacher.position = position;
    if (subject) teacher.subject = subject;
    if (school_name) teacher.school_name = school_name;
    if (school_address) teacher.school_address = school_address;

    teacher.updatedAt = new Date();
    await teacher.save();

    res.status(200).json({ message: "Ma'lumotlar muvaffaqiyatli yangilandi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!", error });
  }
};

exports.getTeacherData = async (req, res) => {
  try {
    const teachers = await Teacher.find().select("-password");
    if (teachers.length === 0) {
      return res.status(404).json({ message: "O'qituvchi topilmadi" });
    }

    res.status(200).json(teachers.reverse());
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!", error });
  }
};

exports.deleteTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "O'qituvchi topilmadi!" });
    }
    await Teacher.findByIdAndDelete(id);
    return res.status(200).json({ message: "O'qituvchi o'chirildi" });
  } catch (error) {
    console.error("Xatolik:", error);
    return res.status(500).json({ message: "Server xatosi!" });
  }
};

exports.updateTeacherPassword = async (req, res) => {
  try {
    const { oldPass, newPass } = req.body;

    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher topilmadi!" });
    }

    const isMatch = await bcrypt.compare(oldPass, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Eski parol noto‘g‘ri!" });
    }

    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(newPass, salt);
    await teacher.save();

    return res
      .status(200)
      .json({ message: "Parol muvaffaqiyatli o‘zgartirildi!" });
  } catch (error) {
    return res.status(500).json({ message: "Server xatosi!" });
  }
};
