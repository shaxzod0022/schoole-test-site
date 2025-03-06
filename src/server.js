require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const testRoutes = require("./routes/testRoutes");
const resultTestRoutes = require("./routes/resultTestRoutes");
const subjectAccessRoutes = require("./routes/subjectAccessRoutes");

const app = express();

app.use(express.json());
app.use(require("cors")());
app.use(require("morgan")("dev"));

connectDB();

app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/results-tests", resultTestRoutes);
app.use("/api/subject-access", subjectAccessRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlayapti`));
