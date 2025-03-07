const { Types } = require("mongoose");
const { Schema, mongo } = require("./user");

const transactionSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    require: true,
    ref: "Users",
  },
  type: {
    type: String,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
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
