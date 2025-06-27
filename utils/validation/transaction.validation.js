const { z } = require("zod");

const transactionSchema = z
  .object({
    amount: z.string(),
    type: z.enum(["Income", "Expense"]),
    category: z.string().min(1, "Category is required"),
    date: z.string(),
    description: z.string().optional(),
    recurring: z.boolean(),
  })
  .strict();

const updateTransactionSchema = z
  .object({
    amount: z.string().optional(),
    type: z.enum(["Income", "Expense"]).optional(),
    category: z.string().optional(),
    date: z.string().optional(),
    description: z.string().optional(),
    recurring: z.boolean().optional(),
  })
  .strict();

module.exports = { transactionSchema, updateTransactionSchema };
