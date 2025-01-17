const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "User not authorized" });
  }

  const token = authToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    req.user = { id };
    next();
  } catch (error) {
    res.status(440).json({ success: false, message: "Session expired" });
  }
};

module.exports = authorize;