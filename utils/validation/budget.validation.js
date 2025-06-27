const { z } = require("zod");

const budgetSchema = z.object({
  category: z.string().min(1),
  limit: z.number().positive(),
  startDate: z.string(),
  endDate: z.string(),
});

module.exports = { budgetSchema };
