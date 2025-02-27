const mongoose = require("mongoose");
require("dotenv").config();

let connection = null;
let establishConnection = async () => {
  try {
    if (process.env.NODE_ENV === "development") {
      connection = await mongoose.connect(
        process.env.MONGO_URI || "mongodb://localhost:27017/admin",
        {
          dbName: process.env.DB_NAME || "ipo",
          auth: {
            username: process.env.DB_USER || "admin",
            password: process.env.DB_PASSWORD || "password",
          },
        }
      );
      console.log("DB connection setup complete");
    } else {
      connection = await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME,
      });
      console.log("DB connection setup complete");
    }
  } catch (err) {
    console.log(err);
    console.log("Failed to connect Database");
  }
};

let disconnectDB = () => {
  connection?.disconnect();
  console.log("DB disconnected");
  connection = null;
};

module.exports = { establishConnection, disconnectDB };
