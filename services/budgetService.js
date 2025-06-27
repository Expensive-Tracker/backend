const { budget } = require("../models/budget");
const budgetHistory = require("../models/budgetHistory");
const transaction = require("../models/transaction");
const moment = require("moment");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { user } = require("../models/user");
const { getCreatedAt } = require("../utils/helper");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILID,
    pass: process.env.PASSWORD,
  },
});

const sendBudgetExceedNotification = async (
  userEmail,
  categoryName,
  spent,
  budgetAmount,
  exceededAmount
) => {
  try {
    const mailOptions = {
      from: '"Expense Tracker" <kerrahul10@gmail.com>',
      to: userEmail,
      subject: "Budget Limit Exceeded - Expense Tracker Alert",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">Budget Limit Exceeded</h2>
          <p>Hello,</p>
          <p>Your spending in the <strong>${categoryName}</strong> category has exceeded the allocated budget.</p>
          
          <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #d32f2f; margin-top: 0;">Budget Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Category:</strong> ${categoryName}</li>
              <li><strong>Budget Limit:</strong> $${budgetAmount.toFixed(
                2
              )}</li>
              <li><strong>Amount Spent:</strong> $${spent.toFixed(2)}</li>
              <li><strong>Exceeded by:</strong> $${exceededAmount.toFixed(
                2
              )}</li>
            </ul>
          </div>
          
          <p>Please review your expenses and consider adjusting your spending to stay within your budget goals.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Expense Tracker Team</strong>
          </p>
        </div>
      `,
      text: `
        Budget Limit Exceeded Alert
        
        Your spending in the ${categoryName} category has exceeded the allocated budget.
        
        Budget Details:
        - Category: ${categoryName}
        - Budget Limit: ₹${budgetAmount.toFixed(2)}
        - Amount Spent: ₹${spent.toFixed(2)}
        - Exceeded by: ₹${exceededAmount.toFixed(2)}
        
        Please review your expenses and consider adjusting your spending to stay within your budget goals.
        
        Best regards,
        Expense Tracker Team
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending budget exceed notification:", error.message);
  }
};

const handleGetUserBudget = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return "Invalid user ID.";
  }

  const userBudget = await budget.findOne({ userId });
  if (!userBudget) return "No budget found for user.";

  const userData = await user.findById(userId);
  const userEmail = userData?.email;

  const currentMonth = moment().format("MMMM YYYY");
  const previousMonth = moment().subtract(1, "month").format("MMMM YYYY");

  const transactions = await transaction.find({
    userId,
    type: "Expense",
  });

  const spentByCategory = {};
  transactions.forEach((tx) => {
    spentByCategory[tx.category] =
      (spentByCategory[tx.category] || 0) + tx.amount;
  });

  let totalSpent = 0;

  if (userBudget.month === currentMonth) {
    const updatedCategories = (userBudget.category || []).map((cat) => {
      const spent = spentByCategory[cat.categoryName] || 0;
      const remain = cat.subBudgetAmount - spent;

      totalSpent += spent;

      if (spent > cat.subBudgetAmount && cat.subBudgetAmount > 0 && userEmail) {
        const exceededAmount = spent - cat.subBudgetAmount;
        const lastNotificationSent = cat.lastNotificationSent;
        const shouldSendNotification =
          !lastNotificationSent ||
          !moment(lastNotificationSent).isSame(moment(), "month");

        if (shouldSendNotification) {
          sendBudgetExceedNotification(
            userEmail,
            cat.categoryName,
            spent,
            cat.subBudgetAmount,
            exceededAmount
          ).catch((err) => {
            console.error(
              "Failed to send budget exceed notification:",
              err.message
            );
          });

          cat.lastNotificationSent = new Date();
        }
      }

      return {
        ...cat.toObject(),
        budgetTransaction: {
          totalSpent: spent,
          totalRemain: remain,
        },
        updatedAt: getCreatedAt(),
        ...(cat.lastNotificationSent && {
          lastNotificationSent: cat.lastNotificationSent,
        }),
      };
    });

    userBudget.set({
      category: updatedCategories,
      updatedAt: getCreatedAt(),
    });

    await userBudget.save();

    return {
      ...userBudget.toObject(),
      totalSpent,
      totalRemain: userBudget.budgetAmount - totalSpent,
    };
  }

  await budgetHistory.create({
    userId: userBudget.userId,
    budgetAmount: userBudget.budgetAmount,
    category: userBudget.category || [],
    month: previousMonth,
  });

  const resetCategories = (userBudget.category || []).map((cat) => ({
    categoryName: cat.categoryName,
    subBudgetAmount: 0,
    budgetTransaction: {
      totalSpent: 0,
      totalRemain: 0,
    },
    updatedAt: getCreatedAt(),
    lastNotificationSent: null,
  }));

  userBudget.set({
    category: resetCategories,
    month: currentMonth,
    updatedAt: getCreatedAt(),
  });

  await userBudget.save();

  return userBudget.toObject();
};

const handleGetSpecificSubBudget = async (budgetId, subBudgetId) => {
  try {
    const budgetDoc = await budget.findOne(
      { _id: budgetId, "category._id": subBudgetId },
      { "category.$": 1 }
    );

    if (!budgetDoc || !budgetDoc.category || budgetDoc.category.length === 0) {
      return { message: "Sub-budget not found." };
    }

    return budgetDoc.category[0];
  } catch (error) {
    console.error("Error fetching sub-budget:", error.message);
    return { error: error.message };
  }
};

const handleAddNewBudget = async (data) => {
  const id = data.id;
  delete data.id;
  const userBudgetExits = await budget.findOne({ userId: id });
  if (userBudgetExits) return "string";
  const budgetToAdd = await budget.create({
    userId: id,
    ...data,
  });
  return budgetToAdd._doc;
};

const handleAddNewSubBudget = async (id, data) => {
  const updatedAt = getCreatedAt();
  const existingBudget = await budget.findById(id);
  if (!existingBudget) return "Budget not found.";

  const categoryExists = existingBudget.category.some(
    (cat) => cat.categoryName.toLowerCase() === data.categoryName.toLowerCase()
  );
  if (categoryExists) return "Category already exists.";

  const totalExistingSubBudget = existingBudget.category.reduce(
    (sum, cat) => sum + cat.subBudgetAmount,
    0
  );

  if (
    totalExistingSubBudget + data.subBudgetAmount >
    existingBudget.budgetAmount
  ) {
    return "Sub-budget exceeds total budget amount.";
  }

  const userId = existingBudget.userId;
  const totalSpentAgg = await transaction.aggregate([
    {
      $match: {
        userId: userId,
        category: data.categoryName,
        type: "expense",
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$amount" },
      },
    },
  ]);

  const totalSpent = totalSpentAgg[0]?.totalSpent || 0;
  const totalRemain = data.subBudgetAmount - totalSpent;
  const newSubBudget = {
    categoryName: data.categoryName,
    subBudgetAmount: data.subBudgetAmount,
    budgetTransaction: {
      totalSpent,
      totalRemain,
    },
    createdAt: updatedAt,
    updatedAt,
  };
  const updatedBudget = await budget.findByIdAndUpdate(
    id,
    {
      $push: { category: newSubBudget },
      $set: { updatedAt },
    },
    { new: true, projection: { category: 1 } }
  );

  return updatedBudget?.category || "Update failed.";
};

const handleEditBudget = async (id, data) => {
  const updatedAt = getCreatedAt();

  const updatedBudget = await budget.findByIdAndUpdate(
    id,
    {
      $set: {
        budgetAmount: data.budgetAmount,
        updatedAt,
      },
    },
    { new: true }
  );

  if (!updatedBudget) {
    return "string";
  }

  return updatedBudget._doc;
};

const handleEditSubBudget = async (budgetId, subBudgetId, data) => {
  const updatedAt = getCreatedAt();

  const fullBudget = await budget.findById(budgetId);
  if (!fullBudget) return "Budget not found";

  const existingCategories = fullBudget.category || [];
  const newTotal = existingCategories.reduce((sum, cat) => {
    if (cat._id.toString() === subBudgetId) {
      return sum + data.subBudgetAmount;
    }
    return sum + cat.subBudgetAmount;
  }, 0);

  if (newTotal > fullBudget.budgetAmount) {
    return "Updated sub-budget exceeds total budget amount.";
  }

  const budgetDoc = await budget.findOne(
    { _id: budgetId, "category._id": subBudgetId },
    { "category.$": 1 }
  );

  if (!budgetDoc || !budgetDoc.category?.[0]) {
    return "Sub-budget not found";
  }

  const currentSubBudget = budgetDoc.category[0];
  const totalSpent = currentSubBudget.budgetTransaction.totalSpent || 0;

  const result = await budget.updateOne(
    { _id: budgetId, "category._id": subBudgetId },
    {
      $set: {
        "category.$.subBudgetAmount": data.subBudgetAmount,
        "category.$.budgetTransaction.totalRemain":
          data.subBudgetAmount - totalSpent,
        "category.$.updatedAt": updatedAt,
        updatedAt,
      },
    }
  );

  if (result.modifiedCount === 0) {
    return "No changes made.";
  }

  const updatedBudget = await budget.findById(budgetId, {
    category: 1,
    _id: 0,
  });

  return updatedBudget.category;
};

const handleDeleteBudget = async (id) => {
  const deletedBudget = await budget.findByIdAndDelete(id);
  if (!deletedBudget) {
    return "string";
  }
  return 1;
};

const handleDeleteSubBudget = async (budgetId, subBudgetId) => {
  const updatedAt = getCreatedAt();
  const updatedBudget = await budget.findByIdAndUpdate(
    budgetId,
    {
      $pull: { category: { _id: subBudgetId } },
      $set: { updatedAt },
    },
    { new: true }
  );

  if (!updatedBudget) {
    return "string";
  }

  return updatedBudget;
};

module.exports = {
  handleGetUserBudget,
  handleAddNewBudget,
  handleAddNewSubBudget,
  handleDeleteBudget,
  handleDeleteSubBudget,
  handleEditBudget,
  handleEditSubBudget,
  handleGetSpecificSubBudget,
};
