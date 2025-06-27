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
} = require("../controllers/transactionController.controller");
const validate = require("../middleware/validation");
const {
  transactionSchema,
  updateTransactionSchema,
} = require("../utils/validation/transaction.validation");
const transactionRoute = endpoint.transaction;

router.post(transactionRoute.getUserTransaction, authMiddleWare, (req, res) => {
  handleGetTransaction(req, res);
});
router.post(
  transactionRoute.newTransaction,
  authMiddleWare,
  validate(transactionSchema),
  (req, res) => {
    handleCreateNewTransaction(req, res);
  }
);

router.get(transactionRoute.specificTransition, authMiddleWare, (req, res) => {
  handleGetSingleTransaction(req, res);
});

router.put(
  transactionRoute.updTransition,
  authMiddleWare,
  validate(updateTransactionSchema),
  (req, res) => {
    handleUpdateTransaction(req, res);
  }
);

router.delete(transactionRoute.deleteTransition, authMiddleWare, (req, res) => {
  handleDeleteTransaction(req, res);
});

router.get(transactionRoute.totalExpense, authMiddleWare, (req, res) => {});

module.exports = router;
