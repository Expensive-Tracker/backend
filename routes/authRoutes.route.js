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
} = require("../controllers/authController.controller");
const authMiddleWare = require("../middleware/authMiddleWare");
const upload = require("../middleware/imageMiddleWare");
const validate = require("../middleware/validation");
const {
  loginSchema,
  registerSchema,
  emailVerificationSchema,
  otpVerificationSchema,
} = require("../utils/validation/auth.validation");
const {
  updateUserSchema,
  changePasswordSchema,
} = require("../utils/validation/user.validation");

const userRoute = endpoint.auth;

router.post(userRoute.login, validate(loginSchema), async (req, res) => {
  loginUser(req, res);
});

router.post(
  userRoute.registration,
  upload.single("profilePic"),
  validate(registerSchema),
  (req, res) => {
    if (req.file) {
      req.body.profilePic = req.file;
    }
    registerUser(req, res);
  }
);

router.post(
  userRoute.emailValidation,
  validate(emailVerificationSchema),
  (req, res) => {
    emailValidation(req, res);
  }
);

router.post(
  userRoute.otpVerification,
  validate(otpVerificationSchema),
  (req, res) => {
    otpVerification(req, res);
  }
);

router.put(
  userRoute.updProfile,
  authMiddleWare,
  upload.single("profilePic"),
  validate(updateUserSchema),
  (req, res) => {
    if (req.file) {
      req.body.profilePic = req.file;
    }
    updateUser(req, res);
  }
);

router.put(
  userRoute.passwordChange,
  validate(changePasswordSchema),
  (req, res) => {
    changePassword(req, res);
  }
);

router.delete(userRoute.deleteUser, authMiddleWare, (req, res) => {
  deleteUser(req, res);
});

// M@JzQ!8@#tLp_rm

module.exports = router;
