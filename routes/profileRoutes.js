const express = require("express");
const {
  HandleUserProfiel,
 
  HandleGetAllUser,
  HandleUpdateUser,
  HandleDeleteUser,
  HanldeCreateUser,
 
  HandleBulkUserUpload,
} = require("../controller/userController");
const authMiddleware = require("../middleware/auth");
const verifyRole = require("../middleware/veryfiyerole");
const upload = require("../middleware/multer");

const route = express.Router();

route.get("/user", authMiddleware, HandleUserProfiel);

route.get(
  "/all-user",
  authMiddleware,
  verifyRole(["manager", "admin"]),
  HandleGetAllUser,
);

route.post(
  "/create",
  authMiddleware,
  verifyRole(["admin"]),
  upload.single("image"),
  HanldeCreateUser,
);

route.put(
  "/user-update/:id",
  authMiddleware,
  verifyRole(["manager", "admin", "user"]),
  upload.single("image"),
  HandleUpdateUser,
);

route.delete(
  "/user-delete/:id",
  authMiddleware,
  verifyRole(["admin"]),
  HandleDeleteUser,
);


route.get("/admin", authMiddleware, verifyRole(["admin"]));

route.get("/manager", authMiddleware, verifyRole(["admin", "manager"]));

module.exports = route;
