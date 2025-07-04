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

// Achievement CRUD Routes
router.post('/', createAchievement);
router.get('/', getAllAchievements);
router.get('/recent', getRecentAchievements);
router.get('/featured', getFeaturedAchievements);
router.get('/stats', getAchievementStats);
router.get('/category/:category', getAchievementsByCategory);
router.get('/:id', getAchievementById);
router.put('/:id',  updateAchievement);
router.delete('/:id', deleteAchievement);

// Image Routes

export default router;
