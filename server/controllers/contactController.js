import exceljs from "exceljs";
import fs from "fs";
import nodemailer from "nodemailer";

export const email = async (req, res) => {
  const { name, email, message } = req.body;
 
const keyword = detectKeyword(message);
const emailContent = generateEmailContent(keyword);

  await sendEmail(email, emailContent);

  await logToExcel({
    name,
    email,
    message,
    keyword,
  });

  res.status(200).json({
    message: "Message received successfull",
  });

  function detectKeyword(message) {
    const keywords = ["job", "vacancy", "internship"];
    for (const keyword of keywords) {
      if (message.toLowerCase().includes(keyword)) {
        return keyword;
      }
    }
    return "general";
  }

  function generateEmailContent(keyword) {
    return keyword === "job"
      ? "Thanks for the job application. We will contact you asap"
      : keyword === "internship"
      ? "Thanks for the internship application. We will contact you asap"
      : keyword === "vacancy"
      ? "Thanks for your curiousity in this vacancy. We will contact you later"
      : keyword === "job" && "vacancy"
      ? "Thanks for curious in both job and vacancy. We will contact you later"
      : keyword === "job" && "intership"
      ? "Thanks for curious in both job and internship. We will contact you later"
      : keyword === "internship" && "vacancy"
      ? "Thanks for curious in both internship and vacancy. We will contact you later"
      : keyword === "job" && "vacancy" &&"internship"
      ? "Thanks for curious in all the events . We will contact you later"
      : "Thanks for your application . We will contact you later";
  }

  
  async function sendEmail(to, content) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host:'smtp.gmail.com',
      port:587,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
      secure:false,
    });


    //this will send back the mail from where the mail came, and its sent the subject as well as the related content based on the keyword
    let mailOptions = {
      from:process.env.USER_EMAIL,
      to,
      subject: "Thanks for contacting with us",
      message: content,
    };
     console.log(mailOptions);
    await transporter.sendMail(mailOptions);
  }
 async function logToExcel({ name, email, message, keyword }) {
   let workBook = new exceljs.Workbook();
   let filepath = "D:\\Backend Intern\\Email-Automation\\server\\contactForm.csv";
   let sheet;

   if (fs.existsSync(filepath)) {
     await workBook.xlsx.readFile(filepath);
     sheet = workBook.getWorksheet("Form Responses");
   } else {
     sheet = workBook.addWorksheet("Form Responses");
   }

   sheet.addRow([
     name,
     email,
     "",
     message,
     "", 
     keyword,
     new Date().toLocaleDateString(),
   ]);

   await workBook.xlsx.writeFile(filepath);
 }
};
