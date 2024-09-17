const express = require("express");
const { connectMongoDB } = require("./config/connection");

const { handleEmail } = require("./controllers/nodemailer");

const app = express();
connectMongoDB("mongodb://127.0.0.1:27017/Email-Automation");

require("dotenv").config();
app.use(express.urlencoded({ extended: true }));

app.post("/sendEmail", handleEmail);

app.listen(3000, () => {
  console.log("server running at port 3000");
});
