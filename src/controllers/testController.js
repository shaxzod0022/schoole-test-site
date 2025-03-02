const Test = require("../models/testModel");

exports.createTest = async (req, res) => {
  try {
    const { subjectId, question, correctAnswer, options } = req.body;

    if (!subjectId || !question || !correctAnswer || !options) {
      return res
        .status(400)
        .json({ message: "Barcha maydonlar to‘ldirilishi shart!" });
    }

    const newTest = new Test({
      subjectId,
      question,
      correctAnswer,
      options,
    });

    await newTest.save();

    res.status(201).json({ message: "Test muvaffaqiyatli yaratildi!" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!", error: error.message });
  }
};

exports.getTest = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const tests = await Test.find({ subjectId }).populate(
      "subjectId",
      "subjectname description"
    );
    if (!tests) {
      return res
        .status(404)
        .json({ message: "Bu fanga tegishli test mavjud emas!" });
    }
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const { subjectId, question, correctAnswer, options } = req.body;
    const { id } = req.params;

    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test topilmadi" });
    }

    if (subjectId) test.subjectId = subjectId;
    if (question) test.question = question;
    if (correctAnswer) test.correctAnswer = correctAnswer;
    if (options) test.options = options;

    await test.save();
    res.status(200).json({ message: "Test yangilandi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test topilmadi!" });
    }
    await Test.findByIdAndDelete(id);
    res.status(200).json({ message: "Test o'chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};
