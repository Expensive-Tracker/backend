require("dotenv").config();
const express = require("express");
const app = express();
const { connectDb } = require("./config/db");
const endpoint = require("./config/endPoint");

connectDb(endpoint.db.user);

app.listen(process.env.port, () => {
  console.log(
    `server running on ${process.env.serverHost}:${process.env.port}`
  );
});
