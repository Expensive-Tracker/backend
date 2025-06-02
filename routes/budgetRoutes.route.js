const endpoint = require("../config/endPoint");
const ex = require("express");
const router = ex.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const {
  handleGetBudget,
  createNewBudget,
  createNewSubBudget,
  editBudget,
  editSubBudget,
  deleteBudget,
  deleteSubBudget,
} = require("../controllers/BudgetController.controller");
const budgetsRoute = endpoint.budgets;

// fetch
router.get(budgetsRoute.allBudgets, authMiddleWare, (req, res) => {
  handleGetBudget(req, res);
});

// create
router.post(budgetsRoute.allBudgets, authMiddleWare, (req, res) => {
  createNewBudget(req, res);
});
router.post(budgetsRoute.subBudgetCreate, authMiddleWare, (req, res) => {
  createNewSubBudget(req, res);
});

// edit
router.put(budgetsRoute.updBudgets, authMiddleWare, (req, res) => {
  editBudget(req, res);
});
router.put(budgetsRoute.updSubBudgets, authMiddleWare, (req, res) => {
  editSubBudget(req, res);
});

// delete
router.delete(budgetsRoute.DeleteBudgets, authMiddleWare, (req, res) => {
  deleteBudget(req, res);
});
router.delete(budgetsRoute.subDeleteBudgets, authMiddleWare, (req, res) => {
  deleteSubBudget(req, res);
});

module.exports = router;
