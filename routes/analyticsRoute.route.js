const ex = require("express");
const endpoint = require("../config/endPoint");
const router = ex.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const analyticsRoute = endpoint.analytics;

router.get(analyticsRoute.categoryExpense, authMiddleWare, (req, res) => {});

router.get(analyticsRoute.monthlyTrends, authMiddleWare, (req, res) => {});

router.get(analyticsRoute.totalIncome, authMiddleWare, (req, res) => {});

module.exports = router;
