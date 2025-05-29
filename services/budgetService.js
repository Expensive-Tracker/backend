const budget = require("../models/budget");
const budgetHistory = require("../models/budgetHistory");
const { getCreatedAt } = require("./authServices");

const handleGetUserBudget = async (userId) => {
  const userBudget = await budget.findOne({ userId });
  if (!userBudget) return "No budget found for user.";
  const currentMonth = moment().format("MMMM YYYY");
  const previousMonth = moment().subtract(1, "month").format("MMMM YYYY");

  if (userBudget.month === currentMonth) {
    return userBudget;
  }

  await budgetHistory.create({
    userId: userBudget.userId,
    budgetAmount: userBudget.budgetAmount,
    category: userBudget.category,
    month: previousMonth,
  });
  userBudget.category = userBudget.category.map((cat) => ({
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
  const userBudgetExits = await budget.findById({ userId: id });
  if (userBudgetExits) return "string";
  const budgetToAdd = await budget.create({
    userId: id,
    ...data,
  });
  return budgetToAdd;
};
const handleAddNewSubBudget = async (id, data) => {
  const updatedAt = getCreatedAt();
  const newSubBudget = {
    categoryName: data.categoryName,
    subBudgetAmount: data.subBudgetAmount,
    budgetTransaction: {
      totalSpent: data.totalSpent || 0,
      totalRemain: data.subBudgetAmount - data.totalSpent,
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

  if (!updatedBudget) return "string";

  return updatedBudget.category;
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
