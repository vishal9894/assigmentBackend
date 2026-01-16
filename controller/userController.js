const User = require("../models/userModels");
const bcrypt = require("bcryptjs");

const HandleUserProfiel = async (req, res) => {
  try {
    const user = await User.findOne(req.user._id).select("-password");
    res.status(200).json({ message: " fetch user sucessfully", user });
  } catch (error) {
    console.log(error);
  }
};

const HanldeCreateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    res.status(201).json({ message: "Create User successful", user });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const HandleGetAllUser = async (req, res) => {
  try {
    let users;

    if (req.user.role === "manager") {
      users = await User.find({ role: "user" }).select("-password");
    } else if (req.user.role === "admin") {
      users = await User.find().select("-password");
    }

    res.status(200).json({ message: "Users fetched", users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const HandleUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: id },
      { name, email, role },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const HandleDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ _id: id });

    res.status(200).json({ message: "user delete sucessfully" });
  } catch (error) {}
};

const HandleAdminProfiel = async (req, res) => {
  try {
    res.send("user admin");
  } catch (error) {
    console.log(error);
  }
};
const HandleManagerProfiel = async (req, res) => {
  try {
    res.send("user manager");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  HandleAdminProfiel,
  HandleUserProfiel,
  HandleManagerProfiel,
  HandleGetAllUser,
  HandleUpdateUser,
  HandleDeleteUser,
  HanldeCreateUser
};
