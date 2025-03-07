require("dotenv").config();
const express = require("express");
const app = express();
const authRoute = require("./routes/authRoutes");
const { connectDb } = require("./config/db");

connectDb();

app.use("/api/auth", authRoute);

app.listen(process.env.port, () => {
  console.log(
    `server running on ${process.env.serverHost}:${process.env.port}`
  );
});
