const moment = require("moment");
const transaction = require("../models/transaction");
const { budget } = require("../models/budget");

const calculateAndUpdateBudgetProgress = async (userId) => {
  const currentMonth = moment().format("MMMM YYYY");

  const userBudget = await budget.findOne({ userId });
  if (!userBudget) return { error: "No budget found" };

  if (userBudget.month !== currentMonth) {
    return { error: "Budget is not for the current month" };
  }
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
  const updatedCategories = userBudget.category.map((cat) => {
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

  // Update the DB
  userBudget.category = updatedCategories.map((c) => ({
    categoryName: c.categoryName,
    subBudgetAmount: c.subBudgetAmount,
    budgetTransaction: {
      totalSpent: c.budgetTransaction.totalSpent,
      totalRemain: c.budgetTransaction.totalRemain,
    },
    updatedAt: new Date(),
  }));
  userBudget.updatedAt = new Date();
  await userBudget.save();

  const totalPercentageSpent =
    userBudget.budgetAmount > 0
      ? parseFloat(((totalSpent / userBudget.budgetAmount) * 100).toFixed(2))
      : 0;

  return {
    totalSpent,
    totalRemain: userBudget.budgetAmount - totalSpent,
    totalPercentageSpent,
    category: updatedCategories,
  };
};
