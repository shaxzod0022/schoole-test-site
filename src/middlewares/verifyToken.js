const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(403).json({ message: "Token yo‘q!" });
  }

  try {
    const tokenValue = token.split(" ")[1];
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Faqat adminlarga ruxsat!" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Noto‘g‘ri token!" });
  }
};

module.exports = verifyAdmin;
