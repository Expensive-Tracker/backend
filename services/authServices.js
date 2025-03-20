const { user } = require("../models/user");
const cloudinary = require("cloudinary").v2;
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltLevel = 10;

cloudinary.config({
  cloud_name: process.env.IMAGE_SAVE_NAME,
  api_key: process.env.IMAGE_SAVE_KEY,
  api_secret: process.env.IMAGE_SAVE_API,
});

const registerUserServices = async (userData) => {
  const userExits = await user.findOne({ email: userData?.email }).exec();
  const notUniqueUserName = await user.findOne({
    username: userData?.username,
  });
  if (userExits) {
    return false;
  } else {
    if (notUniqueUserName) return 1;
    const hashPassword = await bcrypt.hash(userData?.password, saltLevel);
    const createdAt = getCreatedAt();
    const profilePicUrl = await handleMakeUrl(userData?.profilePic);
    const saveUser = await user.create({
      ...userData,
      password: hashPassword,
      createdAt,
      updatedAt: createdAt,
      profilePic: profilePicUrl || "",
    });
    const credential = {
      email: saveUser?.email,
      password: saveUser?.password,
    };
    const token = generateToken(credential);
    return {
      data: saveUser._doc,
      token,
    };
  }
};

const loginUserService = async (userData) => {
  const userExits = await user.findOne({ email: userData?.email });
  if (userExits) {
    const isPasswordSame = await bcrypt.compare(
      userData?.password,
      userExits.password
    );
    if (!isPasswordSame) {
      return false;
    } else {
      const credential = {
        email: userExits?.email,
        password: userExits?.password,
      };
      const token = generateToken(credential);
      return {
        detail: { ...userExits._doc },
        token,
      };
    }
  } else {
    return "string";
  }
};

const updateUserService = async (userData) => {
  const userExits = await user.findOne({ id: userData?.id });
  const notUniqueUserName = await user.findOne({
    username: userData?.username,
  });
  if (userExits) {
    if (notUniqueUserName) {
      return 1;
    }
    const updatedAt = getCreatedAt();
    const userToSave = {
      ...userData,
      updatedAt,
      password: userExits?.password,
      profilePic: userData?.profilePic
        ? userData?.profilePic
        : userExits?.profilePic,
    };
    const updatedUser = await user.findByIdAndUpdate(
      userData._id,
      {
        ...userToSave,
      },
      { new: true, runValidators: true }
    );
    return updatedUser._doc;
  } else {
    return false;
  }
};

const changePasswordService = async (userData) => {
  const userExits = await user.findOne({ email: userData?.email });
  if (userExits) {
    const updatedAt = getCreatedAt();
    const updatedHashPassword = await bcrypt.hash(
      userData?.password,
      saltLevel
    );
    const changesToSave = {
      ...userData,
      password: updatedHashPassword,
      updatedAt,
    };
    const updatedUser = await user.findByIdAndUpdate(
      userData?._id,
      {
        ...changesToSave,
      },
      { new: true, runValidators: true }
    );
    const credential = {
      email: updatedUser?.email,
      password: updatedHashPassword,
    };
    const newTokrn = generateToken(credential);
    return { updatedUser, newTokrn };
  } else {
    return false;
  }
};

const deleteUserService = async (userData) => {
  const userExits = await user.findOne({ email: userData?.email });
  if (userExits) {
    const deletedUser = await user.findByIdAndDelete(userData?._id);
    return { success: deletedUser ? "User deleted" : "Unable to delete user" };
  } else {
    return false;
  }
};

function generateToken(data) {
  const payload = {
    ...data,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  return token;
}

function getCreatedAt() {
  const date = new Date();
  return date;
}

async function handleMakeUrl(image) {
  if (!image) return "";
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "profile_pics" },
        (err, img) => {
          if (err) {
            reject(
              new Error("Error uploading image to Cloudinary: " + err.message)
            );
          } else {
            resolve(img.secure_url);
          }
        }
      );
      if (image.stream) {
        image.stream.pipe(uploadStream);
      } else {
        reject(new Error("Invalid image stream"));
      }
    });
  } catch (err) {
    throw new Error("Error handling image upload: " + err.message);
  }
}

module.exports = {
  registerUserServices,
  loginUserService,
  updateUserService,
  changePasswordService,
  deleteUserService,
};
