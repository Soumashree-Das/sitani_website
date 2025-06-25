import express, { Router } from "express";
import { createProject,getAllProjects,getFeaturedProjects, updateProject } from "../controllers/projects.controller.js";  

const router = Router();

router.post("/createEntryForProject",createProject);//http://localhost:8090/api/v1/projects/createEntryForProject
router.get("/getfeatured",getFeaturedProjects);//http://localhost:8090/api/v1/projects/getfeatured
router.patch("/update/:id",updateProject);//http://localhost:8090/api/v1/projects/update/:id
router.get('/getall', getAllProjects);//http://localhost:8090/api/v1/projects/getAll

export default router;