const Subject = require("../models/subjectModel");

exports.createSubject = async (req, res) => {
  try {
    const { subjectname, description, duration, image } = req.body;

    const exisSubject = await Subject.findOne({ subjectname });
    if (exisSubject) {
      return res.status(400).json({ message: "Bunday nomli fan mavjud!" });
    }

    const newSubject = new Subject({
      subjectname,
      description,
      duration,
      image,
    });

    await newSubject.save();
    res.status(201).json({ message: "Fan muvaffaqiyatli qo'shildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!" });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    if (subjects.length === 0) {
      return res.status(400).json({ message: "Fanlar mavjud emas!" });
    }
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi" });
  }
};

exports.updateSubject = async (req, res) => {
  const { subjectname, description, duration, image } = req.body;
  const { id } = req.params;

  try {
    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({ message: "Fan topilmadi!" });
    }

    if (subjectname) subject.subjectname = subjectname;
    if (description) subject.description = description;
    if (duration) subject.duration = duration;
    if (image) subject.image = image;

    subject.updatedAt = new Date();

    await subject.save();
    res.status(200).json({ message: "Fan muvaffaqiyatli yangilandi", subject });
  } catch (error) {
    console.error("Fan yangilashda xatolik:", error.message);
    res.status(500).json({ message: "Server xatosi!", error: error.message });
  }
};

const Test = require("../models/testModel");

exports.deleteSubject = async (req, res) => {
  const { id } = req.params;

  try {
    const [deletedTests, deletedSubject] = await Promise.all([
      Test.deleteMany({ subjectId: id }),
      Subject.findByIdAndDelete(id),
    ]);

    if (!deletedSubject) {
      return res.status(404).json({ message: "Fan topilmadi!" });
    }

    res.status(200).json({
      message: `Fan va unga bog‘liq ${deletedTests.deletedCount} ta test muvaffaqiyatli o‘chirildi!`,
    });
  } catch (error) {
    console.error("Xatolik:", error);
    res
      .status(500)
      .json({ message: "Server xatosi! Iltimos, qayta urinib ko‘ring." });
  }
};
