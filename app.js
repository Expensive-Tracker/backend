require("dotenv").config();
const express = require("express");
const app = express();
const authRoute = require("./routes/authRoutes.route");
const cors = require("cors");
const transactionRoute = require("./routes/transactionRoute.route");
const analyticsRoute = require("./routes//analyticsRoute.route");
const budgetRoute = require("./routes/budgetRoutes.route");
const { connectDb } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

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

app.use("/api", transactionRoute);

app.use("/api", budgetRoute);

app.use("/api/analytics", analyticsRoute);

app.use(errorHandler);

app.listen(process.env.port, () => {
  console.log(
    `server running on ${process.env.serverHost}:${process.env.port}`
  );
});
