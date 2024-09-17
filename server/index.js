import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { contactRouter } from "./routes/contactRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const filepath = path.join(__dirname, "contact-response.xlsx");
app.use('/static', express.static(filepath))
app.use("/api/contact-form", contactRouter);

app.listen(5000, () => {
  console.log("server is running at port 5000");
});
