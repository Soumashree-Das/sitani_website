
import express from 'express';
import {
  createProject,
  getAllProjects,
  updateProject,
  getFeaturedProjects,
  getProjectImages,
  getProjectVideos,
  serveProjectImage,
  serveProjectVideo,
  deleteProject
} from '../controllers/projects.controller.js';
import multer from 'multer';
import { createUploader } from '../middlewares/fileUpload.middleware.js';


const router = express.Router();

 const projectMediaUpload = createUploader({
  subfolder: 'project-media',
  filePrefix: 'project',
  maxSize: 100, // Max file size in MB
  allowedTypes: [
    'image/jpeg', 
    'image/png', 
    'image/webp', 
    'video/mp4', 
    'video/webm'
  ]
});

router.post('/', projectMediaUpload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
  ]), createProject);
router.get('/', getAllProjects);
router.get('/featured', getFeaturedProjects);
router.put('/update/:id', projectMediaUpload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
  ]),updateProject);
router.delete("/delete/:id",deleteProject);
router.get('/:id/images', getProjectImages);
router.get('/:id/videos', getProjectVideos);
router.get("/media/image/:filename", serveProjectImage);
router.get("/media/video/:filename", serveProjectVideo);

export default router;
