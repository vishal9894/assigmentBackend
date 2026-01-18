require("dotenv").config(); // MUST be first

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Safe debug
console.log("Cloudinary:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: !!process.env.CLOUDINARY_API_KEY,
  secret: !!process.env.CLOUDINARY_API_SECRET,
});

// ✅ FIXED storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "profile_images",
    public_id: `user-${Date.now()}`,
    allowedFormats: ["jpg", "jpeg", "png"],
    transformation: [
      { width: 500, height: 500, crop: "limit" },
    ],
  }),
});

// ✅ Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = upload;
