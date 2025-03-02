const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB-ga ulanish muvaffaqiyatli!");
  } catch (error) {
    console.error("MongoDB-ga ulanishda xatolik:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
