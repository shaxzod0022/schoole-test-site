const SubjectAccess = require("../models/subjectAccessModel");

const allowSubjectAccess = async (req, res) => {
  try {
    const { studentId, subjectId } = req.body;

    let access = await SubjectAccess.findOne({ studentId, subjectId });
    if (access) {
      access.isAllowed = true;
      await access.save();
    } else {
      access = await SubjectAccess.create({
        studentId,
        subjectId,
        isAllowed: true,
      });
    }

    res.status(200).json({ message: "Testga ruxsat berildi", access });
  } catch (error) {
    res.status(500).json({ message: "Xatolik yuz berdi", error });
  }
};

const blockSubjectAccess = async (req, res) => {
  try {
    const { studentId, subjectId } = req.body;
    let access = await SubjectAccess.findOne({ studentId, subjectId });
    if (access) {
      access.isAllowed = false;
      await access.save();
      return res.status(200).json({ message: "Test bloklandi", access });
    }

    res.status(404).json({ message: "Ruxsat topilmadi" });
  } catch (error) {
    res.status(500).json({ message: "Xatolik yuz berdi", error });
  }
};

const checkSubjectAccess = async (req, res) => {
  try {
    const { studentId, subjectId } = req.params;
    const access = await SubjectAccess.findOne({ studentId, subjectId });

    if (!access || !access.isAllowed) {
      return res
        .status(403)
        .json({ message: "Bu testni ishlashga ruxsat yo‘q" });
    }

    res.status(200).json({ message: "Testga ruxsat bor" });
  } catch (error) {
    res.status(500).json({ message: "Xatolik yuz berdi", error });
  }
};

const getSubjectAccessByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const accessList = await SubjectAccess.find({ studentId });

    res.status(200).json(accessList);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!", error });
  }
};

module.exports = {
  allowSubjectAccess,
  blockSubjectAccess,
  checkSubjectAccess,
  getSubjectAccessByStudent,
};
