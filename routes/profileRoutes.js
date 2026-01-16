const express = require("express");
const {
  HandleUserProfiel,
  HandleAdminProfiel,
  HandleManagerProfiel,
  HandleGetAllUser,
  HandleUpdateUser,
  HandleDeleteUser,
} = require("../controller/userController");
const authMiddleware = require("../middleware/auth");
const verifyRole = require("../middleware/veryfiyerole");

const route = express.Router();

route.get("/user", authMiddleware,  HandleUserProfiel);

route.get(
  "/all-user",
  authMiddleware,
  verifyRole(["manager", "admin"]),
  HandleGetAllUser
);

route.put(
  "/user-update/:id",
  authMiddleware,
  verifyRole(["manager", "admin" , "user"]),
  HandleUpdateUser
);

route.delete(
  "/user-delete/:id",
  authMiddleware,
  verifyRole(["admin"]),
  HandleDeleteUser
);

route.get("/admin", authMiddleware, verifyRole(["admin"]), HandleAdminProfiel);

route.get(
  "/manager",
  authMiddleware,
  verifyRole(["admin", "manager"]),
  HandleManagerProfiel
);

module.exports = route;
