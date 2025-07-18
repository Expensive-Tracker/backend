const { Types } = require("mongoose");
const { Schema, mongo } = require("./user");

const transactionSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: "Users",
  },
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  recurring: {
    type: Boolean,
    require: true,
  },
  createdAt: Date,
  updatedAt: Date,
});

const transaction = mongo.model(
  "transactions",
  transactionSchema,
  "Transactions"
);

module.exports = transaction;
