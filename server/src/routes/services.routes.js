import express from 'express';
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    getServiceImage,
    // getServiceImageBase64,
    getActiveServices,
    // getFeaturedServices,
    // getServicesByCategory,
    getServiceStats
} from '../controllers/services.controller.js';
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Service CRUD operations
router.post('/create',upload.single('image'), createService);                // Create new service
router.get('/', getAllServices);                      // Get all services with filters
router.get('/:id', getServiceById);                   // Get single service by ID
router.put('/:id', updateService);                     // Update service
router.delete('/:id', deleteService);                 // Delete service

// Image handling
router.get('/image/:imageId', getServiceImage);       // Get service image file
// router.get('/image/:imageId/base64', getServiceImageBase64); // Get image as base64

// Specialized service queries
router.get('/active/list', getActiveServices);        // Get only active services
// router.get('/featured/list', getFeaturedServices);    // Get featured services
// router.get('/category/:category', getServicesByCategory); // Get services by category
router.get('/stats/all', getServiceStats);            // Get service statistics

export default router;