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
router.post('/', upload.none(), createAchievement);
router.get('/', getAllAchievements);
router.get('/recent', getRecentAchievements);
router.get('/featured', getFeaturedAchievements);
router.get('/stats', getAchievementStats);
router.get('/category/:category', getAchievementsByCategory);
router.get('/:id', getAchievementById);
router.put('/:id', upload.none(), updateAchievement);
router.delete('/:id', deleteAchievement);

// Image Routes

export default router;
// import { getAllAchievements,getRecentAchievements,createAchievement } from "../controllers/acheivements.controller.js";
// import { Router } from "express";

// const router = Router();

// router.post("/create",createAchievement);       //http://localhost:8090/api/v1/acheivements/create
// router.get("/get-recent",getRecentAchievements);//http://localhost:8090/api/v1/acheivements/get-recent
// router.get("/get-all",getAllAchievements);      //http://localhost:8090/api/v1/acheivements/get-all

// export default router;

// Update achievement with optional image upload
