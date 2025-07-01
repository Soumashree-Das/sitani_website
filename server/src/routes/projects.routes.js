// import express, { Router } from "express";
// import { createProject,getAllProjects,getFeaturedProjects, updateProject } from "../controllers/projects.controller.js";  

// const router = Router();

// router.post("/createEntryForProject",createProject);//http://localhost:8090/api/v1/projects/createEntryForProject
// router.get("/getfeatured",getFeaturedProjects);//http://localhost:8090/api/v1/projects/getfeatured
// router.patch("/update/:id",updateProject);//http://localhost:8090/api/v1/projects/update/:id
// router.get('/getall', getAllProjects);//http://localhost:8090/api/v1/projects/getAll

// export default router;
import express from 'express';
import {
  createProject,
  getAllProjects,
  updateProject,
  getFeaturedProjects,
  getProjectImages,
  getProjectVideos
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

  router.get('/:id/images', getProjectImages);
router.get('/:id/videos', getProjectVideos);

export default router;
