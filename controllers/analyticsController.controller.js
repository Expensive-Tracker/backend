const {
  getCategoryBreakdown,
  getSummary,
  getMonthlyTrends,
} = require("../services/analyticsService");

const getSummaryController = async (req, res) => {
  try {
    const userId = req.user._id;

    const data = await getSummary(userId);

    if (typeof data === "number") {
      return res.status(404).json({
        message: "Something went wrong",
      });
    }

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error("Error in getSummaryController:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch financial summary",
      error: err.message,
    });
  }
};

const getMonthlyTrendsController = async (req, res) => {
  try {
    const data = await getMonthlyTrends(req.user._id);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No monthly trend data found." });
    }

    return res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Monthly trends fetch failed", error: err.message });
  }
};

const getCategoryBreakdownController = async (req, res) => {
  try {
    const data = await getCategoryBreakdown(req.user._id);

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No category breakdown data found." });
    }

    return res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Category breakdown fetch failed", error: err.message });
  }
};

module.exports = {
  getSummaryController,
  getMonthlyTrendsController,
  getCategoryBreakdownController,
};
