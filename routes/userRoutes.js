
const express = require("express");
const { HandleSignup, HandleLogin, HandleRefreshToken, HandleLogout } = require("../controller/userAuthController");
const authMiddleware = require("../middleware/auth");

const route = express.Router();

route.post("/register" , HandleSignup);
route.post("/login" , HandleLogin)
route.post("/refresh" , HandleRefreshToken)
route.post("/logout" , HandleLogout)
route.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});


module.exports = route;