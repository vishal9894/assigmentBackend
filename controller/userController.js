const User = require("../models/userModels");
const bcrypt = require("bcryptjs");

const HandleUserProfiel = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ message: " fetch user sucessfully", user });
  } catch (error) {
    console.log(error);
  }
};

const HanldeCreateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const image = req.file ? req.file.path : undefined;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", 
      image
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      message: "User created successfully", 
      user: userResponse 
    });
  } catch (err) {
    console.error("Create User Error:", err);
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
    const { name, email, role } = req.body || {};

    console.log(req.body);
    

    // Permission check
    if (req.user.role === "user" && req.user._id.toString() !== id) {
      return res.status(403).json({
        message: "You can only update your own profile",
      });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // Only admin can update role
    if (role && req.user.role === "admin") {
      updateData.role = role;
    }

    // Update image only if uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update User Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

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



module.exports = {
  
  HandleUserProfiel,
 
  HandleGetAllUser,
  HandleUpdateUser,
  HandleDeleteUser,
  HanldeCreateUser,
};
