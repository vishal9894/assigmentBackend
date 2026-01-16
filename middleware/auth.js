const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.sendStatus(401);

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.sendStatus(401);

    req.user = user; // ALWAYS DB USER
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

module.exports = authMiddleware;
