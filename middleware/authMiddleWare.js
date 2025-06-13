const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired." });
    }

    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

module.exports = authMiddleWare;
