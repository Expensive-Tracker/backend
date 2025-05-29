const endpoint = {
  auth: {
    registration: "/register",
    login: "/login",
    loggedUser: "/user",
    updProfile: "/update-profile",
    passwordChange: "/change-password",
    deleteUser: "/delete-user",
    emailValidation: "/email-valid",
    otpVerification: "/otp-verification",
  },
  transaction: {
    newTransaction: "/transactions/new",
    getUserTransaction: "/transactions",
    specificTransition: "/transactions/:id",
    updTransition: "/transactions/:id",
    deleteTransition: "/transactions/:id",
    totalExpense: "/transactions/summary",
  },
  budgets: {
    monthlyBudgets: "/budgets/:month",
    allBudgets: "/budgets",
    subBudgetCreate: "/budgets/subBudget",
    specificBudgets: "/budgets/:id",
    updBudgets: "/budgets/:id",
    updSubBudgets: "/budgets/subBudget/:id",
    DeleteBudgets: "/budgets/:id",
    subDeleteBudgets: "/budgets/subBudget/:id",
  },
  analytics: {
    totalIncome: "/summary",
    monthlyTrends: "/monthly",
    categoryExpense: "/category-breakdown",
  },
};

module.exports = endpoint;
