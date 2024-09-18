const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');
const { Parser } = require('json2csv');

const nodemailerConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASS
  }
};

const sendEmail = async ({ to, subject, html, attachments }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments
  });
};

const sendWelcomeEmail = async (userEmail) => {
  const subject = "Welcome!";
  const html = `<p>Welcome to our service! Thank you for getting in touch. We'll review your inquiry shortly.</p>`;

  await sendEmail({
    to: userEmail,
    subject,
    html
  });
};

const autoRespondToEmail = async (userMessage, userEmail) => {
  let subject;
  let html;

  const lowerCaseMessage = userMessage.toLowerCase();

  if (lowerCaseMessage.includes('internship')) {
    subject = "Thank You for Your Interest in Our Internship Program";
    html = `<p>Thank you for your interest in our internship program. We'll review your application and get back to you soon.</p>`;
  } else if (lowerCaseMessage.includes('job')) {
    subject = "Thank You for Your Job Inquiry";
    html = `<p>Thank you for your interest in job opportunities with us. Our team will review your application and respond accordingly.</p>`;
  } else if (lowerCaseMessage.includes('support')) {
    subject = "Support Request Received";
    html = `<p>Thank you for reaching out for support. Our support team will get in touch with you shortly.</p>`;
  } else {
    subject = "Thank You for Contacting Us";
    html = `<p>We have received your message. Our team will get back to you shortly.</p>`;
  }

  await sendEmail({
    to: userEmail,
    subject,
    html
  });
};

const logUserToCSV = (userEmail, userMessage) => {
  const filePath = path.join(__dirname, 'user_records.csv');
  const userData = {
    email: userEmail,
    message: userMessage.toLowerCase()
  };

  if (!fs.existsSync(filePath)) {
    const fields = ['email', 'message'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse([userData]);

    fs.writeFileSync(filePath, csv);
  } else {
    const csvLine = `${userData.email},${userData.message}\n`;
    fs.appendFileSync(filePath, csvLine);
  }
};

const handleUserEmail = async (req, res) => {
  const { email: userEmail, message: userMessage } = req.body;

  try {
    await sendWelcomeEmail(userEmail);
    await autoRespondToEmail(userMessage, userEmail);
    logUserToCSV(userEmail, userMessage);
    res.status(200).json({ message: "Emails sent and user logged successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error processing request." });
  }
};

const express = require('express');
const app = express();

app.use(express.json());

app.post('/send-email', handleUserEmail);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
