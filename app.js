require("dotenv").config();
const express = require("express");
const app = express();
const authRoute = require("./routes/authRoutes");
const { connectDb } = require("./config/db");

connectDb();

app.use(express.json());

app.use("/api/auth", authRoute);

app.get("/health", (req, res) => {
  res.send("Called, Server running");
});

app.listen(process.env.port, () => {
  console.log(
    `server running on ${process.env.serverHost}:${process.env.port}`
  );
});
