const nodemailer = require("nodemailer");

async function handleEmail(req, res) {
  console.log(req.body);
  const email = req.body.email
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
    text: "test text",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error while sending email", error);
    } else {
      console.log("email sent", info.response);
    }
  });
  res.send('email sent')
}
module.exports = {
  handleEmail,
};
