const cloudinary = require("cloudinary").v2;
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const fs = require("fs");

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateToken(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(
      "Invalid data provided to generateToken. Expected a non-array object."
    );
  }
  if (!data._id || !data.email) {
    throw new Error(
      "Missing required fields in token payload: '_id' and 'email' are required."
    );
  }
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }
  const payload = {
    _id: data._id,
    email: data.email,
  };
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    return token;
  } catch (err) {
    throw new Error("Failed to generate JWT token: " + err.message);
  }
}

function getCreatedAt() {
  const date = new Date();
  return date;
}

async function handleMakeUrl(file, oldImageUrl = null) {
  if (!file) return "";
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "profile_pics",
    });

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting local image:", err);
      } else {
        console.log("Local image deleted:", file.path);
      }
    });

    if (oldImageUrl) {
      try {
        const publicId = extractPublicIdFromUrl(oldImageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (deleteErr) {
        console.error("Error deleting old image from Cloudinary:", deleteErr);
      }
    }

    return result.secure_url;
  } catch (err) {
    throw new Error("Error uploading image to Cloudinary: " + err.message);
  }
}

function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;

  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) return null;

    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join("/");

    const withoutVersion = pathAfterUpload.replace(/^v\d+\//, "");

    const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch (err) {
    console.error("Error extracting public_id from URL:", err);
    return null;
  }
}

module.exports = {
  extractPublicIdFromUrl,
  handleMakeUrl,
  generateOTP,
  generateToken,
  getCreatedAt,
};
