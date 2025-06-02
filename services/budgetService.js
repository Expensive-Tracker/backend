const { budget } = require("../models/budget");
const budgetHistory = require("../models/budgetHistory");
const { getCreatedAt } = require("./authServices");
const transaction = require("../models/transaction");
const moment = require("moment");

const handleGetUserBudget = async (userId) => {
  const userBudget = await budget.findOne({ userId });
  if (!userBudget) return "No budget found for user.";
  const currentMonth = moment().format("MMMM YYYY");
  const previousMonth = moment().subtract(1, "month").format("MMMM YYYY");
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();

  const transactions = await transaction.find({
    userId,
    type: "expense",
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });
  const spentByCategory = {};
  transactions.forEach((tx) => {
    spentByCategory[tx.category] =
      (spentByCategory[tx.category] || 0) + tx.amount;
  });
  let totalSpent = 0;
  if (userBudget.month === currentMonth) {
    const updatedCategories = (userBudget.category || []).map((cat) => {
      const spent = spentByCategory[cat.categoryName] || 0;
      const remain = cat.subBudgetAmount - spent;
      const spentPercentage =
        cat.subBudgetAmount > 0
          ? parseFloat(((spent / cat.subBudgetAmount) * 100).toFixed(2))
          : 0;

      totalSpent += spent;

      return {
        ...cat.toObject(),
        budgetTransaction: {
          totalSpent: spent,
          totalRemain: remain,
        },
        spentPercentage,
      };
    });
    userBudget.category = updatedCategories;
    return {
      ...userBudget.toObject(),
      totalSpent,
      totalRemain: userBudget.budgetAmount - totalSpent,
    };
  }
  await budgetHistory.create({
    userId: userBudget.userId,
    budgetAmount: userBudget.budgetAmount,
    category: userBudget.category || [],
    month: previousMonth,
  });
  userBudget.category = (userBudget.category || []).map((cat) => ({
    categoryName: cat.categoryName,
    subBudgetAmount: 0,
    budgetTransaction: {
      totalSpent: 0,
      totalRemain: 0,
    },
  }));
  userBudget.month = currentMonth;
  userBudget.updatedAt = getCreatedAt();
  await userBudget.save();

  return userBudget;
};

const handleAddNewBudget = async (data) => {
  const id = data.id;
  delete data.id;
  const userBudgetExits = await budget.findOne({ userId: id });
  if (userBudgetExits) return "string";
  const budgetToAdd = await budget.create({
    userId: id,
    ...data,
  });
  return budgetToAdd._doc;
};

const handleAddNewSubBudget = async (id, data) => {
  const updatedAt = getCreatedAt();
  const existingBudget = await budget.findById(id);
  if (!existingBudget) return "Budget not found.";
  const categoryExists = existingBudget.category.some(
    (cat) => cat.categoryName.toLowerCase() === data.categoryName.toLowerCase()
  );
  if (categoryExists) return "Category already exists.";
  const newSubBudget = {
    categoryName: data.categoryName,
    subBudgetAmount: data.subBudgetAmount,
    budgetTransaction: {
      totalSpent: data.totalSpent || 0,
      totalRemain: data.subBudgetAmount - (data.totalSpent || 0),
    },
    createdAt: updatedAt,
    updatedAt,
  };
  const updatedBudget = await budget.findByIdAndUpdate(
    id,
    {
      $push: { category: newSubBudget },
      $set: { updatedAt },
    },
    { new: true, projection: { category: 1 } }
  );

  return updatedBudget?.category || "Update failed.";
};

const handleEditBudget = async (id, data) => {
  const updatedAt = getCreatedAt();
  const updatedBudget = await budget.findByIdAndUpdate(
    id,
    {
      $set: {
        budgetAmount: data.budgetAmount,
        updatedAt,
      },
    },
    { new: true }
  );

  if (!updatedBudget) {
    return "string";
  }

  return updatedBudget;
};

const handleEditSubBudget = async (budgetId, subBudgetId, data) => {
  const updatedAt = getCreatedAt();
  const result = await budget.updateOne(
    { _id: budgetId, "category._id": subBudgetId },
    {
      $set: {
        "category.$.categoryName": data.categoryName,
        "category.$.subBudgetAmount": data.subBudgetAmount,
        "category.$.budgetTransaction.totalSpent": data.totalSpent,
        "category.$.budgetTransaction.totalRemain":
          data.subBudgetAmount - data.totalSpent,
        "category.$.updatedAt": updatedAt,
        updatedAt,
      },
    }
  );

  if (result.modifiedCount === 0) {
    return "string";
  }

  const updatedBudget = await budget.findById(budgetId, {
    category: 1,
    _id: 0,
  });

  return updatedBudget.category;
};

const handleDeleteBudget = async (id) => {
  const deletedBudget = await budget.findByIdAndDelete(id);
  if (!deletedBudget) {
    return "string";
  }
  return 1;
};

const handleDeleteSubBudget = async (budgetId, subBudgetId) => {
  const updatedAt = getCreatedAt();
  const updatedBudget = await budget.findByIdAndUpdate(
    budgetId,
    {
      $pull: { category: { _id: subBudgetId } },
      $set: { updatedAt },
    },
    { new: true }
  );

  if (!updatedBudget) {
    return "string";
  }

  return updatedBudget;
};

module.exports = {
  handleGetUserBudget,
  handleAddNewBudget,
  handleAddNewSubBudget,
  handleDeleteBudget,
  handleDeleteSubBudget,
  handleEditBudget,
  handleEditSubBudget,
};
