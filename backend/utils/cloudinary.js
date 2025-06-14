const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(
    "Missing required Cloudinary environment variables:",
    missingVars.join(", ")
  );
  process.exit(1);
}

// Configure Cloudinary
console.log("Initializing Cloudinary with config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME
    ? "***" + process.env.CLOUDINARY_CLOUD_NAME.slice(-4)
    : "Not Set",
  api_key: process.env.CLOUDINARY_API_KEY
    ? "***" + process.env.CLOUDINARY_API_KEY.slice(-4)
    : "Not Set",
  api_secret: process.env.CLOUDINARY_API_SECRET
    ? "***" + process.env.CLOUDINARY_API_SECRET.slice(-4)
    : "Not Set",
  upload_preset:
    process.env.CLOUDINARY_UPLOAD_PRESET || "Not Set (using signed upload)",
});

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Always use HTTPS
  });
  console.log("Cloudinary configured successfully");
} catch (error) {
  console.error("Failed to configure Cloudinary:", error);
  process.exit(1);
}

const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  try {
    console.log("Starting file upload to Cloudinary...");
    console.log("File details:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // Convert buffer to base64
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    console.log("Uploading to Cloudinary...");

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "user-documents",
      resource_type: "auto",
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });

    console.log("Upload successful. Secure URL:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      response: error?.response?.data,
    });
    throw new Error("Failed to upload document to Cloudinary");
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete document");
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
