import express from 'express';
import {
  processCompanyForm,
  updateCompanyInfo,
  getAboutUs,
  getContactInfo,
  getImage
} from '../controllers/companyInfo.controller.js';
import { getCompanyHistory } from '../controllers/companyInfo.controller.js';
const router = express.Router();

// GET company info


router.get('/aboutus', getAboutUs);
router.get('/uploads/company-images/:filename', getImage);
router.get('/contactus', getContactInfo);

// UPDATE company info (with file upload)
router.post('/', processCompanyForm, updateCompanyInfo);
router.get('/history', getCompanyHistory);

export default router;