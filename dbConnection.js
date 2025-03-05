const mongoose = require("mongoose");
require("dotenv").config();

let connection = null;
let establishConnection = async () => {
  await new Promise((res, _) => setTimeout(res, 3000));
  console.log("##################### DB Connection");
  try {
    connection = mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "allotment",
    });
    console.log("DB connection setup complete");
  } catch (err) {
    console.log("Failed to connect Database ", err);
  }
};

let disconnectDB = () => {
  connection?.disconnect();
  console.log("DB disconnected");
  connection = null;
};

module.exports = { establishConnection, disconnectDB };
