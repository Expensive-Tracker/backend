const transaction = require("../models/transaction");
const { getCreatedAt } = require("../utils/helper");

const getTransactionService = async (req) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search = "",
  } = req.query;
  const { _id, filter = {} } = req.body;
  const skip = (page - 1) * limit;
  const userExists = await transaction.exists({ userId: _id });
  if (!userExists) {
    return "There is no transaction for this user";
  }
  const query = { userId: _id };
  if (search) {
    query.$or = [
      { category: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (filter.type)
    query.type = filter.type.charAt(0).toUpperCase() + filter.type.slice(1);
  if (filter.category)
    query.category =
      filter.category.charAt(0).toUpperCase() + filter.category.slice(1);
  const startDate = filter.startDate || filter.date?.startDate;
  const endDate = filter.endDate || filter.date?.endDate;
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  const transactions = await transaction
    .find(query)
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  const total = await transaction.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  return {
    data: {
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
      },
    },
  };
};

const getSpecificTransactionService = async (req) => {
  const transactionId = req.params["id"];
  if (!transactionId) {
    return false;
  }
  const result = await transaction.findById(transactionId);
  if (result) {
    return result._doc;
  }
  return "string";
};

const updateTransactionService = async (req) => {
  const transactionId = req.params["id"];
  if (!transactionId) {
    return false;
  }
  const updatedAt = getCreatedAt();
  const newTransactionData = { ...req.body };
  const updateTransaction = await transaction.findByIdAndUpdate(transactionId, {
    ...newTransactionData,
    updatedAt,
  });

  if (updateTransaction) {
    return 1;
  }
  return "string";
};

const createNewTransactionService = async (req) => {
  const data = req.body;
  if (!data["description"]) data["description"] = "-";
  const dateForCreation = getCreatedAt();

  const dataToSave = {
    userId: req.user._id,
    ...data,
    createdAt: dateForCreation,
    updatedAt: dateForCreation,
  };

  const saveData = await transaction.create({
    ...dataToSave,
  });

  return saveData;
};

const deleteTransactionService = async (req) => {
  const transactionId = req.params["id"];
  if (!transactionId) {
    return false;
  }
  const result = await transaction.findByIdAndDelete(transactionId);
  if (result) {
    return 1;
  }
  return "string";
};

module.exports = {
  getSpecificTransactionService,
  getTransactionService,
  updateTransactionService,
  createNewTransactionService,
  deleteTransactionService,
};
