const express = require("express");

const { handleEmail } = require("./controllers/nodemailer");

const app = express();

require("dotenv").config();
app.use(express.urlencoded({ extended: true }));

app.post("/sendEmail", handleEmail);

app.listen(3000, () => {
  console.log("server running at port 3000");
});
