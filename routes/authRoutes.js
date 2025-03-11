const ex = require("express");
const endpoint = require("../config/endPoint");
const router = ex.Router();
const {
  registerUser,
  loginUser,
  updateUser,
  ChangePassword,
} = require("../controllers/authController");

const userRoute = endpoint.auth;

router.post(userRoute.login, async (req, res) => {
  loginUser(req, res);
});

router.post(userRoute.registration, (req, res) => {
  registerUser(req, res);
});

router.post(userRoute.updProfile, (req, res) => {
  updateUser(req, res);
});

router.post(userRoute.passwordChange, (req, res) => {
  ChangePassword(req, res);
});

// M@JzQ!8@#tLp_rm

router.post(userRoute.updProfile, () => {});

router.post(userRoute.passwordChange, () => {});

module.exports = router;
