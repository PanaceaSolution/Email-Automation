const mongoose = require("mongoose");

async function connectMongoDB(URL) {
  return mongoose
    .connect(URL)
    .then(() => console.log("mongoDb connected"))
    .catch((err) => console.log("mongoDB err", err));
}

module.exports = {
  connectMongoDB,
};