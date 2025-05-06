const endpoint = require("../config/endPoint");
const ex = require("express");
const router = ex.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const budgetsRoute = endpoint.budgets;

router.get(budgetsRoute.allBudgets, authMiddleWare, (req, res) => {});

router.get(budgetsRoute.monthlyBudgets, authMiddleWare, (req, res) => {});

router.get(budgetsRoute.specificBudgets, authMiddleWare, (req, res) => {});

router.put(budgetsRoute.updBudgets, authMiddleWare, (req, res) => {});

router.delete(budgetsRoute.DeleteBudgets, authMiddleWare, (req, res) => {});

// router.delete(budgetsRoute.totalExpense, authMiddleWare, (req, res) => {});

module.exports = router;
