import express from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement
} from '../controllers/news.controller.js';

const router = express.Router();

// Announcement routes
router.post('/create', createAnnouncement);//http://localhost:8090/api/v1/announcements/create
router.get('/get', getAnnouncements);//http://localhost:8090/api/v1/announcements/ge
router.delete('/delete', deleteAnnouncement);//http://localhost:8090/api/v1/announcements/delete


export default router;