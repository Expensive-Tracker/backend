const endpoint = require("../config/endPoint");
const ex = require("express");
const router = ex.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const budgetsRoute = endpoint.budgets;

module.exports = router;
