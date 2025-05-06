const ex = require("express");
const endpoint = require("../config/endPoint");
const router = ex.Router();
const {
  registerUser,
  loginUser,
  updateUser,
  changePassword,
  deleteUser,
  emailValidation,
  otpVerification,
} = require("../controllers/authController");
const authMiddleWare = require("../middleware/authMiddleWare");

const userRoute = endpoint.auth;

router.post(userRoute.login, async (req, res) => {
  loginUser(req, res);
});

router.post(userRoute.registration, (req, res) => {
  registerUser(req, res);
});

router.post(userRoute.emailValidation, (req, res) => {
  emailValidation(req, res);
});

router.post(userRoute.otpVerification, (req, res) => {
  otpVerification(req, res);
});

router.put(userRoute.updProfile, authMiddleWare, (req, res) => {
  updateUser(req, res);
});

router.put(userRoute.passwordChange, (req, res) => {
  changePassword(req, res);
});

router.delete(userRoute.deleteUser, authMiddleWare, (req, res) => {
  deleteUser(req, res);
});

// M@JzQ!8@#tLp_rm

module.exports = router;
