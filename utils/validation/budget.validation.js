const { z } = require("zod");

const subBudgetSchema = z
  .object({
    id: z
      .string()
      .refine((val) => val.match(/^[0-9a-fA-F]{24}$/), {
        message: "Invalid MongoDB ObjectId for sub-budget id",
      })
      .optional(),
    categoryName: z.string().min(1, "Category name is required").optional(),
    subBudgetAmount: z
      .number()
      .min(0, "Sub-budget amount must be non-negative")
      .optional(),
  })
  .strict();

const budgetSchema = z
  .object({
    id: z.string().optional(),

    budgetAmount: z
      .string()
      .min(0, "Budget amount must be non-negative")
      .optional(),

    category: z.array(subBudgetSchema).optional(),

    month: z.string().optional(),
  })
  .strict();

module.exports = {
  budgetSchema,
  subBudgetSchema,
};
