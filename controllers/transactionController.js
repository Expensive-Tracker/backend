const {
  createNewTransactionService,
  deleteTransactionService,
  getSpecificTransactionService,
  getTransactionService,
  updateTransactionService,
} = require("../services/transactionService");

const handleGetTransaction = async (req, res) => {};

const handleCreateNewTransaction = async (req, res) => {};

const handleGetSingleTransaction = async (req, res) => {};

const handleUpdateTransaction = async (req, res) => {};

const handleDeleteTransaction = async (req, res) => {};

module.exports = {
  handleCreateNewTransaction,
  handleDeleteTransaction,
  handleGetSingleTransaction,
  handleUpdateTransaction,
  handleGetTransaction,
};
