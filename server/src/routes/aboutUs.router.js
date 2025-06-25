import express from 'express';
import {
  createAboutInfo,
  getAboutContent,
  updateAboutSection
} from '../controllers/about-us.controller.js';
// import upload from '../middleware/uploadMiddleware.js'; // Assuming you have this for file uploads

const router = express.Router();

router.post('/createAboutInfo', createAboutInfo);               //http://localhost:8090/api/v1/about-us/createAboutInfo
// router.post('/', upload.single('image'), createAboutInfo);
router.get('/getAboutInfo', getAboutContent);                   //http://localhost:8090/api/v1/about-us/getAboutInfo
router.put('/update/:section', updateAboutSection);             //http://localhost:8090/api/v1/about-us/update/:section

export default router;