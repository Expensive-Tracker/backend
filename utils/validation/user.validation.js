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
    password: z.string().min(6, "password must be at least 8 characters"),
    email: z.string().email(),
  })
  .strict();
module.exports = { updateUserSchema, changePasswordSchema };
