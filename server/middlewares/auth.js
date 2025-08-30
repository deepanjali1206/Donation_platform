const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request object
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
