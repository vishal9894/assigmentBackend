const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.sendStatus(401);

  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
};

module.exports = authMiddleware;
