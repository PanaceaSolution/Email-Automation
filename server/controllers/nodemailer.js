const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { responses } = require("../response.js");

async function handleEmail(req, res) {
  if (!req.body || !req.body.name || !req.body.email || !req.body.text) {
    return res
      .status(400)
      .json({ msg: "Please fill in all the required fields" });
  }

  const { name, email, text } = req.body;

  const directory = path.join(__dirname, "..", "files");
  const filePath = path.join(directory, "data.csv");

  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true }); // Create the directory if it doesn't exist
    }
  } catch (err) {
    console.error("Error creating directory:", err);
    return res
      .status(500)
      .send({ status: "error", message: "Directory creation failed" });
  }

  try {
    const fileExists = fs.existsSync(filePath);
    const csvHeaders = "S no.,Name,Email Id,Message\n"; // CSV headers

    if (!fileExists) {
      fs.writeFileSync(filePath, csvHeaders);
    }

    const lastRowNumber = fs.readFileSync(filePath, "utf-8").split("\n").length - 2; // Count rows excluding headers
    const newRow = `${lastRowNumber + 1},${name},${email},${text}\n`;

    fs.appendFileSync(filePath, newRow);

    console.log("Data successfully appended to CSV file.");
  } catch (err) {
    console.error("Error while handling CSV file:", err);
    return res
      .status(500)
      .send({ status: "error", message: "Something went wrong with the CSV file" });
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
