const {
  handleGetUserBudget,
  handleAddNewBudget,
  handleAddNewSubBudget,
  handleEditBudget,
  handleEditSubBudget,
  handleDeleteBudget,
  handleDeleteSubBudget,
  handleGetSpecificSubBudget,
} = require("../services/budgetService");

// Get budget for a user
const getBudget = async (req, res) => {
  const userId = req.params.id;
  const { month } = req.query;

  try {
    const result = await handleGetUserBudget(userId, month);

    if (result === "Invalid user ID.") {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    if (result === "No budget found for user.") {
      return res
        .status(404)
        .json({ message: "No budget found for this user." });
    }

    if (result === "Budget history not available") {
      return res
        .status(404)
        .json({ message: "Budget history not available for this month." });
    }

    return res.status(200).json({
      message: "Budget fetched successfully.",
      budget: result,
    });
  } catch (err) {
    console.error("Error fetching budget:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// Get a specific sub-budget
const getSubBudget = async (req, res) => {
  const { id: budgetId, subId: subBudgetId } = req.params;

  try {
    const result = await handleGetSpecificSubBudget(budgetId, subBudgetId);

    if (result?.message === "Sub-budget not found.") {
      return res.status(404).json({ message: result.message });
    }

    return res.status(200).json({
      message: "Sub-budget fetched successfully.",
      category: result,
    });
  } catch (err) {
    console.error("Error fetching sub-budget:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// Create new budget for user
const createBudget = async (req, res) => {
  const data = req.body;

  try {
    const result = await handleAddNewBudget(data);

    if (typeof result === "string") {
      return res.status(409).json({ message: "Budget already exists." });
    }

    return res.status(201).json({
      message: "Budget created successfully.",
      budget: result,
    });
  } catch (err) {
    console.error("Error creating budget:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// Create a new sub-budget
const createSubBudget = async (req, res) => {
  const data = req.body;

  try {
    const result = await handleAddNewSubBudget(data.id, data);

    if (typeof result === "string") {
      return res.status(400).json({ message: result });
    }

    return res.status(201).json({
      message: "Sub-budget category created.",
      category: result,
    });
  } catch (err) {
    console.error("Error creating sub-budget:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// Edit a budget (e.g. update total amount)
const editBudget = async (req, res) => {
  const budgetId = req.params.id;
  const data = req.body;

  try {
    const result = await handleEditBudget(budgetId, data);

    if (typeof result === "string") {
      return res.status(404).json({ message: "Budget not found." });
    }

    return res.status(200).json({
      message: "Budget updated successfully.",
      budget: result,
    });
  } catch (err) {
    console.error("Error updating budget:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

const editSubBudget = async (req, res) => {
  const { id, subId } = req.params;
  const data = req.body;

  try {
    const result = await handleEditSubBudget(id, subId, data);

    if (typeof result === "string") {
      return res.status(400).json({ message: result });
    }

    return res.status(200).json({
      message: "Sub-budget updated successfully.",
      category: result,
    });
  } catch (err) {
    console.error("Error updating sub-budget:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

const deleteBudget = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await handleDeleteBudget(id);

    if (result === "string") {
      return res.status(404).json({ message: "Budget not found." });
    }

    return res.status(200).json({ message: "Budget deleted successfully." });
  } catch (err) {
    console.error("Error deleting budget:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

const deleteSubBudget = async (req, res) => {
  const { id, subId } = req.params;

  try {
    const result = await handleDeleteSubBudget(id, subId);

    if (result === "string") {
      return res.status(404).json({ message: "Sub-budget not found." });
    }

    return res.status(200).json({
      message: "Sub-budget deleted successfully.",
      category: result.category,
    });
  } catch (err) {
    console.error("Error deleting sub-budget:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  getBudget,
  getSubBudget,
  createBudget,
  createSubBudget,
  editBudget,
  editSubBudget,
  deleteBudget,
  deleteSubBudget,
};
