const {
  createNewTransactionService,
  deleteTransactionService,
  getSpecificTransactionService,
  getTransactionService,
  updateTransactionService,
} = require("../services/transactionService");

const handleGetTransaction = async (req, res) => {
  try {
    const result = await getTransactionService(req);
    if (typeof result === "object") {
      return res.status(200).json({ message: "transaction fetched", result });
    } else if (typeof result === "number") {
      return res.status(404).json({ message: "There are no transaction" });
    } else {
      return res.status(404).json({ message: result });
    }
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: err?.message });
  }
};

const handleCreateNewTransaction = async (req, res) => {
  try {
    const result = await createNewTransactionService(req);
    return res
      .status(200)
      .json({ message: "New transaction added", data: result });
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: err?.message });
  }
};

const handleGetSingleTransaction = async (req, res) => {
  try {
    const result = await getSpecificTransactionService(req);
    if (typeof result === "string" || typeof result === "boolean") {
      return res.status(404).json({
        message: `There is no transaction with ${req.params["id"]}`,
      });
    } else {
      return res.status(200).json({
        message: "transaction fetched",
        data: { ...result },
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      message: err?.message,
    });
  }
};

const handleUpdateTransaction = async (req, res) => {
  try {
    const result = await updateTransactionService(req);
    if (typeof result === "string" || typeof result === "boolean") {
      return res.status(404).json({
        message: "something went wrong",
      });
    } else {
      return res.status(200).json({
        message: "Transaction Updated successfully",
      });
    }
  } catch (err) {
    console.error(err?.message);
  }
};

const handleDeleteTransaction = async (req, res) => {
  try {
    const result = await deleteTransactionService(req);
    if (typeof result === "string" || typeof result === "boolean") {
      return res.status(404).json({
        message: "something went wrong",
      });
    } else {
      return res.status(200).json({
        message: "Transaction deleted",
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      message: err?.message,
    });
  }
};

module.exports = {
  handleCreateNewTransaction,
  handleDeleteTransaction,
  handleGetSingleTransaction,
  handleUpdateTransaction,
  handleGetTransaction,
};
