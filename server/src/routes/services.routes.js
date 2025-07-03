
import express from 'express';
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    getActiveServices,
    getServiceStats
} from '../controllers/services.controller.js';
import { serviceImageUpload } from "../middlewares/fileUpload.middleware.js"

const router = express.Router();

// Service routes with proper middleware integration
router.post('/create',
    serviceImageUpload.single('image'), // Handle single image upload
    createService
);

router.get('/', getAllServices); // Get all services with optional filtering

router.get('/active', getActiveServices); // Get only active services

router.get('/stats', getServiceStats); // Get service statistics

router.get('/:id', getServiceById); // Get single service by ID

router.put('/update/:id',
    serviceImageUpload.single('image'), // Handle single image upload for updates
    updateService
);

router.delete('/:id', deleteService); // Delete service

export default router;