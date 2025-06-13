const { budget } = require("../models/budget");
const transaction = require("../models/transaction");

const { ObjectId } = require("mongodb");

const getSummary = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const matchConditions = { userId: new ObjectId(userId) };

    const summary = await transaction.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const budgetData = await budget.findOne({ userId: new ObjectId(userId) });
    const budgetAmount = budgetData ? budgetData.budgetAmount : 0;

    const incomeData = summary.find((item) => item._id === "Income") || {
      total: 0,
    };

    const expenseData = summary.find((item) => item._id === "Expense") || {
      total: 0,
    };

    const result = {
      totalIncome: incomeData.total,
      totalExpenses: expenseData.total,
      balance: budgetAmount - expenseData.total,
    };

    return result;
  } catch (error) {
    console.error("Error in getSummary:", error.message);
    throw new Error(`Failed to get financial summary: ${error.message}`);
  }
};

const getMonthlyTrends = async (userId) => {
  try {
    const totalDocs = await transaction.countDocuments({});
    if (totalDocs === 0) {
      return {
        categories: [],
        series: [
          { name: "Income", data: [] },
          { name: "Expenses", data: [] },
        ],
      };
    }

    const userIdAsString = await transaction.countDocuments({ userId: userId });
    const userIdAsObjectId = await transaction.countDocuments({
      userId: new ObjectId(userId),
    });
    const userIdAsUserField = await transaction.countDocuments({
      user: userId,
    });
    const userIdAsUserObjectId = await transaction.countDocuments({
      user: new ObjectId(userId),
    });
    const userIdAsUser_id = await transaction.countDocuments({
      user_id: userId,
    });
    const userIdAsUser_idObjectId = await transaction.countDocuments({
      user_id: new ObjectId(userId),
    });

    let matchQuery = {};
    let userDocsCount = 0;

    if (userIdAsObjectId > 0) {
      matchQuery = { userId: new ObjectId(userId) };
      userDocsCount = userIdAsObjectId;
    } else if (userIdAsString > 0) {
      matchQuery = { userId: userId };
      userDocsCount = userIdAsString;
    } else if (userIdAsUserObjectId > 0) {
      matchQuery = { user: new ObjectId(userId) };
      userDocsCount = userIdAsUserObjectId;
    } else if (userIdAsUserField > 0) {
      matchQuery = { user: userId };
      userDocsCount = userIdAsUserField;
    } else if (userIdAsUser_idObjectId > 0) {
      matchQuery = { user_id: new ObjectId(userId) };
      userDocsCount = userIdAsUser_idObjectId;
    } else if (userIdAsUser_id > 0) {
      matchQuery = { user_id: userId };
      userDocsCount = userIdAsUser_id;
    } else {
      return {
        categories: [],
        series: [
          { name: "Income", data: [] },
          { name: "Expenses", data: [] },
        ],
      };
    }

    const docsWithoutDate = await transaction.countDocuments({
      ...matchQuery,
      date: { $exists: false },
    });
    const docsWithoutType = await transaction.countDocuments({
      ...matchQuery,
      type: { $exists: false },
    });
    const docsWithoutAmount = await transaction.countDocuments({
      ...matchQuery,
      amount: { $exists: false },
    });

    const dateTypes = await transaction.aggregate([
      { $match: matchQuery },
      { $limit: 5 },
      { $project: { dateType: { $type: "$date" }, date: 1 } },
    ]);

    const data = await transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    if (data.length === 0) {
      const invalidDates = await transaction.countDocuments({
        ...matchQuery,
        $or: [
          { date: null },
          { date: { $type: "string" } },
          { date: { $exists: false } },
        ],
      });

      return {
        categories: [],
        series: [
          { name: "Income", data: [] },
          { name: "Expenses", data: [] },
        ],
      };
    }

    const monthlyData = {};
    data.forEach(({ _id, total }) => {
      const key = `${_id.month}-${_id.year}`;
      if (!monthlyData[key]) {
        monthlyData[key] = { income: 0, expense: 0, expenses: 0 };
      }

      if (_id.type === "income" || _id.type === "Income") {
        monthlyData[key].income = total;
      } else if (
        _id.type === "expense" ||
        _id.type === "Expense" ||
        _id.type === "expenses" ||
        _id.type === "Expenses"
      ) {
        monthlyData[key].expense = total;
        monthlyData[key].expenses = total;
      }
    });

    const categories = Object.keys(monthlyData).sort();
    const incomeSeries = categories.map((c) => monthlyData[c].income || 0);
    const expenseSeries = categories.map(
      (c) => monthlyData[c].expense || monthlyData[c].expenses || 0
    );

    return {
      categories,
      series: [
        { name: "Income", data: incomeSeries },
        { name: "Expenses", data: expenseSeries },
      ],
    };
  } catch (error) {
    return {
      categories: [],
      series: [
        { name: "Income", data: [] },
        { name: "Expenses", data: [] },
      ],
    };
  }
};

const getCategoryBreakdown = async (userId) => {
  const categoryData = await transaction.aggregate([
    { $match: { userId: new ObjectId(userId), type: "Expense" } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
  ]);

  const labels = categoryData.map((item) => item._id);
  const series = categoryData.map((item) => item.total);

  return { labels, series };
};

module.exports = {
  getSummary,
  getMonthlyTrends,
  getCategoryBreakdown,
};
