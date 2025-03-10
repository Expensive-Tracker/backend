const endpoint = {
  auth: {
    registration: "/register",
    login: "/login",
    loggedUser: "/user",
    updProfile: "/update-profile",
    passwordChange: "/change-password",
  },
  transaction: {
    newTransaction: "/api/transactions",
    getUserTransaction: "/api/transactions",
    specificTransition: "/api/transactions/:id",
    updTransition: "/api/transactions/:id",
    deleteTransition: "/api/transactions/:id",
    totalExpense: "/api/transactions/summary",
  },
  budgets: {
    monthlyBudgets: "/api/budgets",
    allBudgets: "/api/budgets",
    specificBudgets: "/api/budgets/:id",
    updBudgets: "/api/budgets/:id",
    DeleteBudgets: "/api/budgets/:id",
  },
  analytics: {
    totalIncome: "/api/analytics/summary",
    monthlyTrends: "/api/analytics/monthly",
    categoryExpense: "/api/analytics/category-breakdown",
  },
};

module.exports = endpoint;
