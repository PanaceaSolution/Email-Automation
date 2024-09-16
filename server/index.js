require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sendEmail } = require('./mailer');
const app = express();
const fs = require('fs');
const path = require('path');

function saveToCSV(name, email, message) {
  const filePath = path.join(__dirname, 'form_submissions.csv');
  const row = `${name},${email},${message}\n`;

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // Create a new file with headers if it doesn't exist
    fs.writeFileSync(filePath, 'Name,Email,Message\n');
  }

  // Append the new row to the CSV file
  fs.appendFile(filePath, row, (err) => {
    if (err) {
      console.error('Error saving form data:', err);
    } else {
      console.log('Form data saved successfully!');
    }
  });
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;
  
    // Perform keyword check and send appropriate email response
    const responseMessage = checkKeywordsAndRespond(message, email);
  
    // Save form data to CSV instead of Google Sheets
    saveToCSV(name, email, message);
  
    res.send({ message: "Form submitted successfully!" });
  });
  

function checkKeywordsAndRespond(message, userEmail) {
  let responseMessage = "Thank you for reaching out!";

  // Customize responses based on keywords
  if (message.toLowerCase().includes("internship")) {
    responseMessage = "Thank you for your interest in our internship program. We'll review your application and get back to you.";
    sendEmail(userEmail, "Internship Opportunity", responseMessage);
  } else if (message.toLowerCase().includes("job")) {
    responseMessage = "Thank you for your interest in a job with our company. We'll review your resume and get in touch shortly.";
    sendEmail(userEmail, "Job Application Received", responseMessage);
  } else if (message.toLowerCase().includes("vacancy")) {
    responseMessage = "Thank you for inquiring about vacancies at our company. We'll update you if there's an opening that matches your skills.";
    sendEmail(userEmail, "Vacancy Inquiry", responseMessage);
  } else {
    responseMessage = "Thank you for your message. We'll respond to your inquiry shortly.";
    sendEmail(userEmail, "General Inquiry", responseMessage);
  }

  return responseMessage;
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
