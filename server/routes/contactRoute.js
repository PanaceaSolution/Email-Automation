import express from "express";

import { email } from  '../controllers/contactController.js'

const router = express.Router();

router.post("/email", email);

export const contactRouter = router;
