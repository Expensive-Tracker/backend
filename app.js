const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDb } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleWare");
const userIdRateLimiter = require("./middleware/rateLimiter");

const authRoute = require("./routes/authRoutes.route");
const transactionRoute = require("./routes/transactionRoute.route");
const analyticsRoute = require("./routes/analyticsRoute.route");
const budgetRoute = require("./routes/budgetRoutes.route");

const app = express();

connectDb();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoute);

app.use(authMiddleware);
app.use(userIdRateLimiter);

app.use("/api", transactionRoute);
app.use("/api", budgetRoute);
app.use("/api/analytics", analyticsRoute);

app.use(errorHandler);

app.listen(process.env.port, () => {
  console.log(
    `Server running on ${process.env.serverHost}:${process.env.port}`
  );
});
