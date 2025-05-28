const {
  handleGetUserBudget,
  handleAddNewBudget,
  handleAddNewSubBudget,
  handleEditBudget,
  handleEditSubBudget,
  handleDeleteBudget,
  handleDeleteSubBudget,
} = require("../services/budgetService");

const handleGetBudget = async (req, res) => {
  const { userId } = req.body;
  try {
    const response = await handleGetUserBudget(userId);
    if (typeof response === "string") {
      return res.status(400).json({
        message: "There is no Budgets for this user",
      });
    } else {
      return res.status(200).json({
        message: "Fetch budgets",
        budget: { ...response },
      });
    }
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: err?.message });
  }
};

const createNewBudget = async (req, res) => {
  const data = req.body;
  try {
    const result = await handleAddNewBudget(data);
    if (typeof result === "string")
      return res.status(400).json({
        message: "Budget already exits",
      });
    return res.status(200).json({
      message: "Budget fetched",
      budget: { ...result },
    });
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({
      message: err?.message,
    });
  }
};
const createNewSubBudget = async (req, res) => {
  const userDetail = { ...req.body };
  try {
    const result = await handleAddNewSubBudget(userDetail.id, userDetail);
    if (typeof result === "string")
      return res.status(400).json({ message: "something went wrong" });
    return res
      .status(200)
      .json({ message: "Category created", category: { ...result } });
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: err?.message });
  }
};

const editBudget = async (req, res) => {
  handleEditBudget();
};
const editSubBudget = async (req, res) => {
  handleEditSubBudget();
};

const deleteBudget = async (req, res) => {
  handleDeleteBudget();
};
const deleteSubBudget = async (req, res) => {
  handleDeleteSubBudget();
};

module.exports = {
  handleGetBudget,
  createNewBudget,
  createNewSubBudget,
  deleteBudget,
  deleteSubBudget,
  editBudget,
  editSubBudget,
};
