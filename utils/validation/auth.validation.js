const { z } = require("zod");

const registerSchema = z
  .object({
    username: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict();

const loginSchema = z.object({
  userNameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

const emailVerificationSchema = z.object({
  email: z.string().email(),
});

const otpVerificationSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    otp: z.string().min(4, "OTP must be at least 4 characters"),
  })
  .strict();

module.exports = {
  registerSchema,
  loginSchema,
  emailVerificationSchema,
  otpVerificationSchema,
};
