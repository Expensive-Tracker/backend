const { Types } = require("mongoose");
const { Schema, mongo } = require("./user");

const subBudgetSchema = new Schema({
  categoryName: {
    type: String,
    required: true,
  },
  subBudgetAmount: {
    type: Number,
    required: true,
  },
  budgetTransaction: {
    totalSpent: { type: Number, required: true },
    totalRemain: { type: Number, required: true },
  },
  createdAt: Date,
  updatedAt: Date,
});

const budgetsSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "Users",
  },
  budgetAmount: {
    type: Number,
    required: true,
  },
  category: {
    type: [subBudgetSchema],
    required: false,
  },
  month: String,
  createdAt: Date,
  updatedAt: Date,
});

const budget = mongo.model("budgets", budgetsSchema, "Budgets");

module.exports = { budget, subBudgetSchema };
