const endpoint = {
  auth: {
    registration: "/register",
    login: "/login",
    loggedUser: "/user",
    updProfile: "/update-profile",
    passwordChange: "/change-password",
    deleteUser: "/delete-user",
  },
  transaction: {
    newTransaction: "/transactions",
    getUserTransaction: "/transactions",
    specificTransition: "/transactions/:id",
    updTransition: "/transactions/:id",
    deleteTransition: "/transactions/:id",
    totalExpense: "/transactions/summary",
  },
  budgets: {
    monthlyBudgets: "/budgets",
    allBudgets: "/budgets",
    specificBudgets: "/budgets/:id",
    updBudgets: "/budgets/:id",
    DeleteBudgets: "/budgets/:id",
  },
  analytics: {
    totalIncome: "/summary",
    monthlyTrends: "/monthly",
    categoryExpense: "/category-breakdown",
  },
};

module.exports = endpoint;
