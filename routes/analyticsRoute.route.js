const express = require("express");
const router = express.Router();
const endpoint = require("../config/endPoint");
const authMiddleWare = require("../middleware/authMiddleWare");
const {
  getSummaryController,
  getMonthlyTrendsController,
  getCategoryBreakdownController,
} = require("../controllers/analyticsController.controller");

const analyticsRoute = endpoint.analytics;

router.get(analyticsRoute.totalIncome, authMiddleWare, getSummaryController);
router.get(
  analyticsRoute.monthlyTrends,
  authMiddleWare,
  getMonthlyTrendsController
);
router.get(
  analyticsRoute.categoryExpense,
  authMiddleWare,
  getCategoryBreakdownController
);

module.exports = router;
