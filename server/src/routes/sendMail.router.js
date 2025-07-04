// In your app.js
import { handleFormSubmission } from '../controllers/sendMail.controller.js';
import Router from "express";

const router = Router();
// Route
router.post('/contact', handleFormSubmission);

export default router;