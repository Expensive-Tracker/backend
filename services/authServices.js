const { user } = require("../models/user");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const {
  generateToken,
  getCreatedAt,
  handleMakeUrl,
  generateOTP,
} = require("../utils/helper");
const saltLevel = 10;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILID,
    pass: process.env.PASSWORD,
  },
});

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
    let profilePicUrl;
    if (userData?.profilePic) {
      profilePicUrl = await handleMakeUrl(userData?.profilePic);
    }
    const saveUser = await user.create({
      ...userData,
      password: hashPassword,
      createdAt,
      updatedAt: createdAt,
      profilePic: profilePicUrl || "",
      otp: "",
      otpExpire: null,
    });
    const dataToSend = {
      ...userData,
      _id: saveUser._id,
      createdAt,
      updatedAt: createdAt,
      profilePic: profilePicUrl || "",
      isNew: true,
    };
    delete dataToSend["password"];
    const credential = {
      email: saveUser?.email,
      _id: saveUser?._id,
    };
    const token = generateToken(credential);
    return {
      data: dataToSend,
      token,
    };
  }
};

const loginUserService = async (userData) => {
  const userExits = await user.findOne({
    $or: [
      { email: userData?.userNameOrEmail },
      { username: userData?.userNameOrEmail },
    ],
  });

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
        _id: userExits?._id,
      };
      const userDetail = { ...userExits._doc };
      delete userDetail.otp;
      delete userDetail.otpExpire;
      const token = generateToken(credential);
      return {
        detail: { ...userDetail },
        token,
      };
    }
  } else {
    return "string";
  }
};

const updateUserService = async (userData) => {
  const userExits = await user.findOne({ _id: userData?._id });
  const notUniqueUserName = await user.findOne({
    username: userData?.username,
    _id: { $ne: userData?._id },
  });

  if (userExits) {
    if (notUniqueUserName) {
      return 1;
    }

    let profilePicUrl = userExits?.profilePic;
    if (userData?.profilePic && typeof userData.profilePic === "object") {
      profilePicUrl = await handleMakeUrl(
        userData?.profilePic,
        userExits?.profilePic
      );
    }

    const updatedAt = getCreatedAt();

    const userToSave = {
      ...userData,
      updatedAt,
      password: userExits?.password,
      profilePic: profilePicUrl,
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
    const updatedUser = await user.findOneAndUpdate(
      { email: userExits?.email },
      {
        $set: {
          password: updatedHashPassword,
          updatedAt,
        },
      },
      { new: true, runValidators: true }
    );
    return { updatedUser };
  } else {
    return false;
  }
};

const deleteUserService = async (userData) => {
  const userExits = await user.findOne({ _id: userData?._id });
  if (userExits) {
    const deletedUser = await user.findByIdAndDelete(userData?._id);
    return { success: deletedUser ? "User deleted" : "Unable to delete user" };
  } else {
    return false;
  }
};

const handleEmailValidateService = async (userData, req) => {
  const userExits = await user.findOne({ email: userData?.email });
  try {
    if (userExits) {
      const otp = generateOTP();
      const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
      const mailOptions = {
        from: '"Expensive Tracker" <kerrahul10@gmail.com>',
        to: userData.email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
      };
      await transporter.sendMail(mailOptions);
      await user.findByIdAndUpdate(userExits._id, {
        otp,
        otpExpire,
      });
      const tokenPayload = {
        _id: req.user._id,
        email: req.user.email,
      };
      const otpToken = generateToken(tokenPayload);
      return { otpToken };
    } else {
      return false;
    }
  } catch (err) {
    console.error(err.message);
  }
};

const otpVerificationService = async (userData) => {
  const userExits = await user.findOne({ email: userData?.email });
  if (userExits) {
    if (!userExits.otp || !userExits.otpExpire) return 1;
    if (new Date() > userExits.otpExpire) return "string";
    if (userData.otp !== userExits.otp) return undefined;
    await user.findByIdAndUpdate(userExits._id, { otp: "", otpExpire: null });
    const correctOtpToken = generateToken({ _i });
    return { message: "Otp is correct", correctOtpToken };
  } else {
    return false;
  }
};

module.exports = {
  registerUserServices,
  loginUserService,
  updateUserService,
  changePasswordService,
  deleteUserService,
  handleEmailValidateService,
  otpVerificationService,
};
