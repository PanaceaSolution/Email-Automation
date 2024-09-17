const nodemailer = require("nodemailer");
const { UserData } = require("../models/user.js");
const { responses } = require("../response.js");

async function handleEmail(req, res) {
  // Validate request body
  if (!req.body || !req.body.name || !req.body.email || !req.body.text) {
    return res
      .status(400)
      .json({ msg: "Please fill in all the required fields" });
  }

  const { name, email, text } = req.body;

  // Save to database
  try {
    const result = await UserData.create({
      name,
      email,
      text,
    });
    console.log("Successfully saved to DB");
  } catch (err) {
    console.error("Error while saving to DB:", err);
    return res
      .status(500)
      .json({ msg: "Error while saving to DB", error: err.message });
  }

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PW,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_ID,
    to: email,
    subject: "Response from Email-Automation",
    text: "thanks",
  };

  // Determine the appropriate response
  for (const key in responses) {
    if (text.toLowerCase().includes(key)) {
      console.log(key);
      mailOptions.text = responses[key];
      break;
    }
  }

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return res
      .status(200)
      .json({ msg: "Email sent successfully", response: info.response });
  } catch (error) {
    console.error("Error while sending email:", error);
    return res
      .status(500)
      .json({ msg: "Error while sending email", error: error.message });
  }
}

module.exports = {
  handleEmail,
};
