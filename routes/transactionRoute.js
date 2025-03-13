const endpoint = require("../config/endPoint");
const ex = require("express");
const router = ex.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const transactionRoute = endpoint.transaction;

router.get(
  transactionRoute.getUserTransaction,
  authMiddleWare,
  (req, res) => {}
);
router.post(transactionRoute.newTransaction, authMiddleWare, (req, res) => {});

router.get(
  transactionRoute.specificTransition,
  authMiddleWare,
  (req, res) => {}
);

router.put(transactionRoute.updTransition, authMiddleWare, (req, res) => {});

router.delete(
  transactionRoute.deleteTransition,
  authMiddleWare,
  (req, res) => {}
);

router.get(transactionRoute.totalExpense, authMiddleWare, (req, res) => {});

module.exports = router;
