const Test = require("../models/testModel");
const TestResult = require("../models/resultTestModel");

exports.resultTest = async (req, res) => {
  try {
    const { studentId, subjectId, answers } = req.body;

    // Kirish ma'lumotlarini tekshirish
    if (
      !studentId ||
      !subjectId ||
      !Array.isArray(answers) ||
      answers.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Barcha maydonlar to‘ldirilishi shart" });
    }

    // Oldingi test natijalarini o‘chirish (shu student va shu subject bo‘yicha)
    await TestResult.deleteMany({ studentId, subjectId });

    // Barcha testlarni bazadan olish
    const testIds = answers.map((a) => a.questionId);
    const tests = await Test.find({ _id: { $in: testIds } });

    if (!tests.length) {
      return res.status(404).json({ message: "Testlar topilmadi" });
    }

    // Natijalarni shakllantirish
    const testResults = answers
      .map((answer) => {
        const test = tests.find((t) => t._id.equals(answer.questionId));
        return test
          ? {
              testId: test._id,
              question: test.question,
              selectedOption: answer.selectedOption,
              correctAnswer: test.correctAnswer,
              isCorrect: answer.selectedOption === test.correctAnswer,
            }
          : null;
      })
      .filter(Boolean); // null qiymatlarni olib tashlash

    // Yangi test natijalarini saqlash
    const testResult = await TestResult.create({
      studentId,
      subjectId,
      results: testResults,
    });

    res.status(201).json({
      message: "Test natijalari yangilandi",
      testResult,
    });
  } catch (error) {
    console.error("Test natijalarini saqlashda xatolik:", error.message);
    res.status(500).json({ message: "Ichki server xatosi" });
  }
};

exports.getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Kirish ma'lumotlarini tekshirish
    if (!studentId) {
      return res.status(400).json({ message: "Student ID talab qilinadi" });
    }

    // Studentga tegishli natijalarni bazadan olish (subject ma’lumotlari bilan birga)
    const results = await TestResult.find({ studentId }).populate(
      "subjectId",
      "name"
    );

    if (!results.length) {
      return res
        .status(404)
        .json({ message: "Sizda test natijalari mavjud emas" });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error("Student test natijalarini olishda xatolik:", error.message);
    res.status(500).json({ message: "Ichki server xatosi" });
  }
};
