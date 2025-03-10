const mongo = require("mongoose");
const URL = process.env.DB_URL;

const connectDb = async () => {
  try {
    await mongo.connect(URL);
    console.log("Database connected");
  } catch (err) {
    console.error("error connecting to Database", err.message);
    process.exit(1);
  }
};

module.exports = { connectDb, mongo };
