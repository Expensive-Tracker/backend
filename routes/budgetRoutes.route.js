const endpoint = require("../config/endPoint");
const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");

const {
  getBudget,
  getSubBudget,
  createBudget,
  createSubBudget,
  editBudget,
  editSubBudget,
  deleteBudget,
  deleteSubBudget,
} = require("../controllers/BudgetController.controller");
const validate = require("../middleware/validation");
const {
  subBudgetSchema,
  budgetSchema,
} = require("../utils/validation/budget.validation");

const budgetsRoute = endpoint.budgets;

// Fetch
router.get(budgetsRoute.allBudgets, authMiddleWare, getBudget);
router.get(budgetsRoute.specificBudgets, authMiddleWare, getSubBudget);

// Create
router.post(
  budgetsRoute.allBudgets.replace("/:id", ""),
  authMiddleWare,
  validate(budgetSchema),
  createBudget
);
router.post(
  budgetsRoute.subBudgetCreate,
  authMiddleWare,
  validate(subBudgetSchema),
  createSubBudget
);

// Edit
router.put(
  budgetsRoute.updBudgets,
  authMiddleWare,
  validate(budgetSchema),
  editBudget
);
router.put(
  budgetsRoute.updSubBudgets,
  authMiddleWare,
  validate(subBudgetSchema),
  editSubBudget
);

// Delete
router.delete(budgetsRoute.DeleteBudgets, authMiddleWare, deleteBudget);
router.delete(budgetsRoute.subDeleteBudgets, authMiddleWare, deleteSubBudget);

module.exports = router;
