const { z } = require("zod");

const updateUserSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })
  .strict();

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    email: z.string().email(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

module.exports = { updateUserSchema, changePasswordSchema };
