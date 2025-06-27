const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.IMAGE_SAVE_NAME,
  api_key: process.env.IMAGE_SAVE_KEY,
  api_secret: process.env.IMAGE_SAVE_API,
});
