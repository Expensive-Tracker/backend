const {
  registerUserServices,
  loginUserService,
  updateUserService,
  changePasswordService,
  deleteUserService,
  handleEmailValidateService,
  otpVerificationService,
} = require("../services/authServices");

const registerUser = async (req, res) => {
  const userData = { ...req.body };
  if (req.file) {
    userData.profilePic = req.file;
  }
  try {
    const response = await registerUserServices(userData);
    res.setHeader("Content-Type", "application/json");
    if (!response) {
      return res.status(404).json({ message: "User Exits, Try Login" });
    } else {
      if (typeof response === "number")
        return res.status(404).json({ message: "Username Should Be Unique" });
      return res.status(200).json({
        message: "Registration Successful",
        data: { ...response },
      });
    }
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: err?.message });
  }
};

const loginUser = async (req, res) => {
  const user = req.body;
  try {
    const response = await loginUserService(user);
    res.setHeader("Content-Type", "application/json");
    if (typeof response === "boolean" || typeof response === "object") {
      if (typeof response === "boolean") {
        return res.status(404).json({ message: "password is Invalid" });
      } else {
        return res.status(200).json({
          message: "Login Successful",
          response,
        });
      }
    } else {
      return res
        .status(404)
        .json({ message: "User don't exits try Registering" });
    }
  } catch (err) {
    res.status(500).json({ message: err?.message });
  }
  res.end();
};

const updateUser = async (req, res) => {
  const userData = req.body;
  const id = req.user._id;
  userData._id = id;
  if (req.file) {
    userData.profilePic = req.file;
  }
  try {
    const response = await updateUserService(userData);
    res.setHeader("Content-Type", "application/json");
    if (response) {
      if (typeof response == "number") {
        return res.status(404).json({
          message: "Username should be unique",
        });
      } else {
        return res.status(200).json({
          message: "Update Successful",
          data: response,
        });
      }
    } else {
      return res.status(404).json({ message: "User don't exits" });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const changePassword = async (req, res) => {
  const userData = req.body;
  try {
    const response = await changePasswordService(userData);
    res.setHeader("Content-Type", "application/json");
    if (response) {
      return res.status(200).json({
        message: "Password Updated Successful",
        data: response,
      });
    } else {
      return res.status(404).json({ message: "User don't exits" });
    }
  } catch (err) {
    throw new Error(err?.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const response = await deleteUserService(req);
    res.setHeader("Content-Type", "application/json");
    if (response) {
      return res.status(200).json({ ...response });
    } else {
      return res.status(404).json({ message: "User don't exits" });
    }
  } catch (err) {
    throw new Error(err?.message);
  }
};

const emailValidation = async (req, res) => {
  const userData = req.body;
  res.setHeader("Content-Type", "application/json");
  try {
    const response = await handleEmailValidateService(userData);
    if (typeof response === "boolean") {
      return res.status(404).json({ message: "User not Exits" });
    }
    return res.status(200).json({
      message: "Otp sended",
      otpToken: response["otpToken"],
    });
  } catch (err) {
    console.error(err.message);
  }
};

const otpVerification = async (req, res) => {
  const userData = req.body;
  res.setHeader("Content-Type", "application/json");
  try {
    const response = await otpVerificationService(userData, req);
    if (typeof response === "boolean") {
      return res.status(404).json({ message: "User doesn't exits" });
    }
    if (typeof response === "string") {
      return res.status(404).json({ message: "Otp Expired" });
    }
    if (typeof response === "undefined") {
      return res.status(404).json({ message: "Incorrect otp" });
    }
    return res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  changePassword,
  deleteUser,
  emailValidation,
  otpVerification,
};
