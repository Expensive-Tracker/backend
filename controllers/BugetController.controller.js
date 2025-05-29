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
      return res.status(404).json({
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
      return res.status(404).json({
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
      return res.status(404).json({ message: "something went wrong" });
    return res
      .status(200)
      .json({ message: "Category created", category: { ...result } });
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: err?.message });
  }
};

const editBudget = async (req, res) => {
  const userDetail = { ...req.body };
  try {
    const result = await handleEditBudget(userDetail.id, userDetail);
    if (typeof result === "string")
      return res.status(404).json({
        message: "something went wrong",
      });
    return res.status(200).json({
      message: "Budget updated",
      budget: { ...result },
    });
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({ message: err?.message });
  }
};
const editSubBudget = async (req, res) => {
  try {
    const { budgetId, subBudgetId } = req.params;
    const data = req.body;

    const updatedCategory = await handleEditSubBudget(
      budgetId,
      subBudgetId,
      data
    );
    if (updatedCategory === "string") {
      return res
        .status(404)
        .json({ message: "Sub-budget not found or not updated." });
    }
    return res.status(200).json({ category: updatedCategory });
  } catch (error) {
    console.error("Error editing sub-budget:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;

    const result = await handleDeleteBudget(budgetId);

    if (result === "string") {
      return res.status(404).json({ message: "Budget not found." });
    }

    return res.status(200).json({ message: "Budget deleted successfully." });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const deleteSubBudget = async (req, res) => {
  try {
    const { budgetId, subBudgetId } = req.params;

    const updatedBudget = await handleDeleteSubBudget(budgetId, subBudgetId);

    if (updatedBudget === "string") {
      return res.status(404).json({ message: "Sub-budget not found." });
    }

    return res.status(200).json({
      message: "Sub-budget deleted successfully.",
      category: updatedBudget.category,
    });
  } catch (error) {
    console.error("Error deleting sub-budget:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
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
