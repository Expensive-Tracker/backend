const mongo = require("mongoose");
const URL = process.env.DB_URL;

const connectDb = async (dbType) => {
  try {
    await mongo.createConnection(URL + dbType);
    console.log("Database connected for", dbType);
  } catch (err) {
    console.error("error connecting to Database", err.message);
    process.exit(1);
  }
};

module.exports = { connectDb, mongo };
