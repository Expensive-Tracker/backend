require("dotenv").config();
const express = require("express");
const app = express();
const authRoute = require("./routes/authRoutes");
const cors = require("cors");
const transactionRoute = require("./routes/transactionRoute");
const analyticsRoute = require("./routes//analyticsRoute");
const budgetRoute = require("./routes/budgetRoutes");
const { connectDb } = require("./config/db");

connectDb();

app.use(
  cors({
    origin: "http://localhost:3000", // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Enable if using cookies or authentication
  })
);

app.use(express.json());

app.use("/api/auth", authRoute);

app.use("/api", transactionRoute);

app.use("/api", budgetRoute);

app.use("/api/analytics", analyticsRoute);

app.listen(process.env.port, () => {
  console.log(
    `server running on ${process.env.serverHost}:${process.env.port}`
  );
});
