import express from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
  updateAnnouncement
} from '../controllers/news.controller.js';

const router = express.Router();

// Announcement routes
router.post('/create', createAnnouncement);//http://localhost:8090/api/v1/announcements/create
router.get('/get', getAnnouncements);//http://localhost:8090/api/v1/announcements/get
router.delete('/delete/:id', deleteAnnouncement);//http://localhost:8090/api/v1/announcements/delete/:id
router.put('/update/:id', updateAnnouncement); // http://localhost:8090/api/v1/announcements/update/:id

export default router;