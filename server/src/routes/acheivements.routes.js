import express from 'express';
import multer from 'multer';
import {
  createAchievement,
  getAllAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
  getRecentAchievements,
  getFeaturedAchievements,
  getAchievementsByCategory,
  getAchievementStats,
  getAchievementImage,
  getAchievementImageBase64
} from '../controllers/acheivements.controller.js';

const router = express.Router();

// Multer configuration for image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for images
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Achievement CRUD Routes
router.post('/', upload.single('image'), createAchievement);
router.get('/', getAllAchievements);
router.get('/recent', getRecentAchievements);
router.get('/featured', getFeaturedAchievements);
router.get('/stats', getAchievementStats);
router.get('/category/:category', getAchievementsByCategory);
router.get('/:id', getAchievementById);
router.put('/:id', upload.single('image'), updateAchievement);
router.delete('/:id', deleteAchievement);

// Image Routes
router.get('/image/:imageId', getAchievementImage); // Serves actual image
router.get('/image-base64/:imageId', getAchievementImageBase64); // Returns base64

export default router;
// import { getAllAchievements,getRecentAchievements,createAchievement } from "../controllers/acheivements.controller.js";
// import { Router } from "express";

// const router = Router();

// router.post("/create",createAchievement);       //http://localhost:8090/api/v1/acheivements/create
// router.get("/get-recent",getRecentAchievements);//http://localhost:8090/api/v1/acheivements/get-recent
// router.get("/get-all",getAllAchievements);      //http://localhost:8090/api/v1/acheivements/get-all

// export default router;