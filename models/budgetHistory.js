const { Types } = require("mongoose");
const { Schema, mongo } = require("./user");

const budgetHistorySchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "Users",
  },
  budgetAmount: Number,
  category: [subBudgetSchema],
  month: String,
  createdAt: { type: Date, default: Date.now },
});

const budgetHistory = mongo.model(
  "budgetHistory",
  budgetHistorySchema,
  "BudgetHistory"
);

module.exports = { budget, budgetHistory };
