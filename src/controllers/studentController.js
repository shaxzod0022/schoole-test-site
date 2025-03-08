const bcrypt = require("bcrypt");
const Student = require("../models/studentModal");
const jwt = require("jsonwebtoken");

exports.loginStudent = async (req, res) => {
  const { username, password } = req.body;
  try {
    const student = await Student.findOne({ username });
    if (!student)
      return res.status(400).json({ message: "Foydalanuvchi topilmadi!" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Parol xato!" });

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, student: { _id: student._id } });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!" });
  }
};

exports.createStudent = async (req, res) => {
  const {
    firstname,
    lastname,
    middlename,
    dateOfBirth,
    username,
    password,
    role,
    position,
    profile_image,
    school_name,
    school_address,
    gender,
    email,
    phone,
    className,
  } = req.body;

  try {
    if (
      !firstname ||
      !lastname ||
      !phone ||
      !email ||
      !username ||
      !password ||
      !className ||
      !school_name
    ) {
      return res
        .status(400)
        .json({ message: "Kerakli maydonlarni to'ldiring!" });
    }

    const exisStudent = await Student.findOne({ username });
    if (exisStudent) {
      return res
        .status(400)
        .json({ message: "Bu foydalanuvchi allaqachon mavjud!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new Student({
      firstname,
      lastname,
      middlename,
      dateOfBirth,
      username,
      password: hashedPassword,
      role,
      position,
      profile_image,
      school_name,
      school_address,
      gender,
      email,
      phone,
      className,
    });

    await newStudent.save();
    return res
      .status(200)
      .json({ message: "O'quvchi muvaffaqiyatli qo'shildi" });
  } catch (error) {
    return res.status(500).json({ message: "Server Xatosi!" });
  }
};

exports.getStudentsData = async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    if (students.length === 0) {
      res.status(404).json({ message: "O'quvchi topilmadi" });
    }
    res.status(200).json(students.reverse());
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!", error });
  }
};

exports.updateStudentData = async (req, res) => {
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
    className,
    school_address,
    middlename,
  } = req.body;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "O'quvchi topilmadi" });
    }

    if (firstname) student.firstname = firstname;
    if (lastname) student.lastname = lastname;
    if (middlename) student.middlename = middlename;
    if (phone) student.phone = phone;
    if (email) student.email = email;
    if (username) student.username = username;
    if (profile_image) student.profile_image = profile_image;
    if (dateOfBirth) student.dateOfBirth = dateOfBirth;
    if (gender) student.gender = gender;
    if (position) student.position = position;
    if (school_name) student.school_name = school_name;
    if (school_address) student.school_address = school_address;

    student.updatedAt = new Date();
    await student.save();

    res.status(200).json({ message: "Ma'lumotlar muvaffaqiyatli yangilandi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!" });
  }
};

exports.deleteStudentData = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "O'quvchi topilmadi!" });
    }
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "O'quvchi muvaffaqiyatli o'chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPass, newPass } = req.body;
    const student = await Student.findById(req.user.id);
    if (!student)
      return res.status(400).json({ message: "Foydalanuvchi topilmadi!" });

    const isMatch = await bcrypt.compare(oldPass, student.password);
    if (!isMatch) return res.status(400).json({ message: "Parol noto'g'ri!" });

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPass, salt);
    await student.save();

    res.status(200).json({ message: "Parol muvaffaqiyatli o'zgartirildi!" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!" });
  }
};
