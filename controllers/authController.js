const {
  registerUserServices,
  loginUserService,
  updateUserService,
  changePasswordService,
} = require("../services/authServices");

const registerUser = async (req, res) => {
  const userData = req.body;
  try {
    const response = await registerUserServices(userData);
    if (!response) {
      return res.status(400).json({ message: "User Exits, try LogIn" });
    } else {
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
    console.log("Login", response);
    if (typeof response === "boolean" || typeof response === "object") {
      if (response === false) {
        return res.status(400).json({ message: "password is Invalid" });
      } else {
        return res.status(200).json({
          message: "Login Successful",
          response,
        });
      }
    } else {
      return res
        .status(400)
        .json({ message: "User don't exits try Registering" });
    }
  } catch (err) {
    res.status(500).json({ message: err?.message });
  }
  res.end();
};

const updateUser = async (req, res) => {
  const userData = req.body;
  try {
    const response = await updateUserService(userData);
    console.log("Update user Response =>>>>>>", response);
    if (response) {
      return res.status(200).json({
        message: "Update Successful",
        data: response,
      });
    } else {
      return res.status(400).json({ message: "User don't exits" });
    }
  } catch (err) {
    throw new Error(err?.message);
  }
};

const changePassword = async (req, res) => {
  const userData = req.body;
  try {
    const response = await changePasswordService(userData);
    console.log("ChangePassword Response =>>>>>>", response);
    if (response) {
      return res.status(200).json({
        message: "Password Updated Successful",
        data: response,
      });
    } else {
      return res.status(400).json({ message: "User don't exits" });
    }
  } catch (err) {
    throw new Error(err?.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  changePassword,
};
