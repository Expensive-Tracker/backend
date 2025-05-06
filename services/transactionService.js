const transaction = require("../models/transaction");

const getTransactionService = async (userData) => {
  const userExits = await transaction.findById({ userId: userData._id });
  if (userExits) {
  } else {
    return false;
  }
};

const getSpecificTransactionService = async (userData) => {};

const updateTransactionService = async (userData) => {};

const createNewTransactionService = async (userData) => {};

const deleteTransactionService = async (userData) => {};

module.exports = {
  getSpecificTransactionService,
  getTransactionService,
  updateTransactionService,
  createNewTransactionService,
  deleteTransactionService,
};
