const { Types } = require("mongoose");
const { Schema, mongo } = require("./user");

const budgetsSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    require: true,
    ref: "Users",
  },
  budgetAmount: {
    type: Number,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  month: String,
  createdAt: Date,
  updatedAt: Date,
});

const budget = mongo.model("budgets", budgetsSchema, "Budgets");
module.exports = budget;
