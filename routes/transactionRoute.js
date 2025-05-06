const endpoint = require("../config/endPoint");
const ex = require("express");
const router = ex.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const {
  handleCreateNewTransaction,
  handleDeleteTransaction,
  handleGetSingleTransaction,
  handleGetTransaction,
  handleUpdateTransaction,
} = require("../controllers/transactionController");
const transactionRoute = endpoint.transaction;

router.get(transactionRoute.getUserTransaction, authMiddleWare, (req, res) => {
  handleGetTransaction(req, res);
});
router.post(transactionRoute.newTransaction, authMiddleWare, (req, res) => {
  handleCreateNewTransaction(req, res);
});

router.get(transactionRoute.specificTransition, authMiddleWare, (req, res) => {
  handleGetSingleTransaction(req, res);
});

router.put(transactionRoute.updTransition, authMiddleWare, (req, res) => {
  handleUpdateTransaction(req, res);
});

router.delete(transactionRoute.deleteTransition, authMiddleWare, (req, res) => {
  handleDeleteTransaction(req, res);
});

router.get(transactionRoute.totalExpense, authMiddleWare, (req, res) => {});

module.exports = router;
