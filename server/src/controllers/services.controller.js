// // // src/controllers/services.controller.js
// // import Service from '../models/services.model.js';
// // import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
// // import crypto from 'crypto';
// // import path from "path";
// // import mongoose from 'mongoose';

// // let servicesGridFSBucket;

// // export const initializeServicesGridFS = async (mongoUri) => {
// //   try {
// //     const client = await MongoClient.connect(mongoUri, { useUnifiedTopology: true });
// //     servicesGridFSBucket = new GridFSBucket(client.db(), { bucketName: 'service_images' });
// //     console.log('Service GridFS initialized');
// //   } catch (err) {
// //     console.error('GridFS init error:', err);
// //     throw err;
// //   }
// // };

// // const uploadServiceImageToGridFS = (fileBuffer, originalName, mimetype) => {
// //   return new Promise((resolve, reject) => {
// //     if (!servicesGridFSBucket) return reject(new Error('GridFS not initialized'));

// //     const filename = crypto.randomBytes(16).toString('hex') + path.extname(originalName);
// //     const stream = servicesGridFSBucket.openUploadStream(filename, {
// //       metadata: { originalName, mimetype, uploadDate: new Date(), type: 'service_image' }
// //     });

// //     stream.end(fileBuffer);
// //     stream.on('finish', () => resolve({ fileId: stream.id.toString(), filename }));
// //     stream.on('error', reject);
// //   });
// // };

// // export const createService = async (req, res) => {
// //   try {
// //     const { heading, description, isActive, displayOrder, category, tags, externalUrl, featured } = req.body;
// //     if (!heading || !description || !category) {
// //       return res.status(400).json({ success: false, error: 'Required fields missing' });
// //     }

// //     let imageData = {};
// //     if (req.file) {
// //       try {
// //         const result = await uploadServiceImageToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype);
// //         imageData = {
// //           imageId: result.fileId,
// //           imageUrl: `/api/v1/services/image/${result.fileId}`
// //         };
// //       } catch (e) {
// //         console.error('Image upload failed:', e);
// //       }
// //     }

// //     const service = new Service({
// //       heading,
// //       description,
// //       isActive: isActive === 'true' || isActive === true,
// //       displayOrder: Number(displayOrder) || 0,
// //       category,
// //       tags,
// //       externalUrl,
// //       featured,
// //       ...imageData
// //     });

// //     await service.save();
// //     res.status(201).json({ success: true, data: service, message: 'Service created' });
// //   } catch (err) {
// //     console.error('Create service error:', err);
// //     res.status(500).json({ success: false, error: err.message });
// //   }
// // };

// export const getAllServices = async (req, res) => {
//   try {
//     const { activeOnly, sort = 'displayOrder', limit = 10, skip = 0 } = req.query;
//     const filter = activeOnly === 'true' ? { isActive: true } : {};

//     const services = await Service.find(filter)
//       .sort(sort)
//       .limit(Number(limit))
//       .skip(Number(skip));

//     const total = await Service.countDocuments(filter);
//     res.json({ success: true, count: services.length, total, data: services });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// export const getServiceById = async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);
//     if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
//     res.json({ success: true, data: service });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // export const getServiceImage = async (req, res) => {
// //   try {
// //     if (!servicesGridFSBucket) return res.status(500).json({ error: 'GridFS not initialized' });
// //     const imageId = new ObjectId(req.params.imageId);
// //     const [file] = await servicesGridFSBucket.find({ _id: imageId }).toArray();
// //     if (!file) return res.status(404).json({ error: 'Image not found' });

// //     res.set({
// //       'Content-Type': file.metadata?.mimetype || 'image/jpeg',
// //       'Cache-Control': 'public, max-age=31536000'
// //     });
// //     servicesGridFSBucket.openDownloadStream(imageId).pipe(res);
// //   } catch (err) {
// //     console.error('Get image error:', err);
// //     if (!res.headersSent) res.status(500).json({ error: 'Server error' });
// //   }
// // };

// // export const updateService = async (req, res) => {
// //   try {
// //     let updateData = {
// //       heading: req.body.heading,
// //       description: req.body.description,
// //       isActive: req.body.isActive === 'true' || req.body.isActive === true,
// //       displayOrder: Number(req.body.displayOrder) || 0,
// //       category: req.body.category,
// //       tags: req.body.tags,
// //       externalUrl: req.body.externalUrl,
// //       featured: req.body.featured === 'true' || req.body.featured === true
// //     };

// //     if (req.file) {
// //       const oldService = await Service.findById(req.params.id);
// //       if (oldService?.imageId) {
// //         try { await servicesGridFSBucket.delete(new ObjectId(oldService.imageId)); } catch (e) {}
// //       }

// //       const result = await uploadServiceImageToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype);
// //       updateData.imageId = result.fileId;
// //       updateData.imageUrl = `/api/v1/services/image/${result.fileId}`;
// //     }

// //     const updated = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
// //     if (!updated) return res.status(404).json({ success: false, error: 'Service not found' });

// //     res.json({ success: true, data: updated, message: 'Service updated' });
// //   } catch (err) {
// //     res.status(500).json({ success: false, error: err.message });
// //   }
// // };

// // export const deleteService = async (req, res) => {
// //   try {
// //     const service = await Service.findById(req.params.id);
// //     if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
// //     if (service.imageId) {
// //       try { await servicesGridFSBucket.delete(new ObjectId(service.imageId)); } catch (e) {}
// //     }
// //     await Service.findByIdAndDelete(req.params.id);
// //     res.json({ success: true, message: 'Service deleted' });
// //   } catch (err) {
// //     res.status(500).json({ success: false, error: err.message });
// //   }
// // };

// // export const getActiveServices = async (req, res) => {
// //   try {
// //     const services = await Service.find({ isActive: true }).sort('displayOrder').limit(Number(req.query.limit) || 10);
// //     res.json({ success: true, data: services });
// //   } catch (err) {
// //     res.status(500).json({ success: false, error: err.message });
// //   }
// // };

// // export const getServiceStats = async (req, res) => {
// //   try {
// //     const total = await Service.countDocuments();
// //     const active = await Service.countDocuments({ isActive: true });
// //     res.json({ success: true, data: { total, active, inactive: total - active } });
// //   } catch (err) {
// //     res.status(500).json({ success: false, error: err.message });
// //   }
// // };
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import Service from '../models/services.model.js'; // Adjust path as needed

// // Configure storage for service images
// const serviceStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = path.join(process.cwd(), 'uploads/service-images');

//         // Create directory if it doesn't exist
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true });
//         }

//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);
//         cb(null, 'service-' + uniqueSuffix + ext);
//     }
// });

// // Multer configuration for service image storage
// const serviceUpload = multer({
//     storage: serviceStorage,
//     limits: {
//         fileSize: 10 * 1024 * 1024 // 10MB
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only image files are allowed!'), false);
//         }
//     }
// });

// // Middleware for handling service image upload - accepts any multipart data
// export const uploadServiceImage = serviceUpload.any();

// // Create a new service
// export const createService = async (req, res) => {
//     // Check if req.body exists
//     if (!req.body) {
//         return res.status(400).json({ error: "Request body is missing!" });
//     }

//     const { heading, description, category, tags, externalUrl, featured, displayOrder } = req.body;

//     if (!description || !category) {
//         return res.status(400).json({ error: "Description and category are required!" });
//     }

//     try {
//         const newService = new Service({
//             heading,
//             description,
//             category,
//             tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
//             externalUrl,
//             featured: featured === 'true' || featured === true,
//             displayOrder: displayOrder ? parseInt(displayOrder) : 0
//         });

//         // Handle service image upload if present
//         const uploadedFile = req.files && req.files.find(file => file.fieldname === 'serviceImage');
//         if (uploadedFile && uploadedFile.filename) {
//             // Store the absolute path
//             const fullPath = path.join(process.cwd(), 'uploads', 'service-images', uploadedFile.filename);
//             newService.imagePath = fullPath;
//         }

//         console.log('Service image path:', newService.imagePath);

//         await newService.save();

//         return res.status(201).json({
//             message: "Service created successfully",
//             service: {
//                 id: newService._id,
//                 heading: newService.heading,
//                 description: newService.description,
//                 category: newService.category,
//                 imagePath: newService.imagePath,
//                 tags: newService.tags,
//                 externalUrl: newService.externalUrl,
//                 featured: newService.featured,
//                 displayOrder: newService.displayOrder,
//                 hasImage: newService.hasImage
//             }
//         });

//     } catch (error) {
//         console.error("Service creation error:", error);
//         return res.status(500).json({
//             error: "Internal server error",
//             details: error.message
//         });
//     }
// };

// // Update an existing service
// export const updateService = async (req, res) => {
//     const { id } = req.params;
//     const { heading, description, category, tags, externalUrl, featured, displayOrder, isActive } = req.body;

//     try {
//         const service = await Service.findById(id);
//         if (!service) {
//             return res.status(404).json({ error: "Service not found" });
//         }

//         // Update fields if provided
//         if (heading !== undefined) service.heading = heading;
//         if (description !== undefined) service.description = description;
//         if (category !== undefined) service.category = category;
//         if (tags !== undefined) {
//             service.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
//         }
//         if (externalUrl !== undefined) service.externalUrl = externalUrl;
//         if (featured !== undefined) service.featured = featured === 'true' || featured === true;
//         if (displayOrder !== undefined) service.displayOrder = parseInt(displayOrder);
//         if (isActive !== undefined) service.isActive = isActive === 'true' || isActive === true;

//         // Handle image upload if present
//         const uploadedFile = req.files && req.files.find(file => file.fieldname === 'serviceImage');
//         if (uploadedFile && uploadedFile.filename) {
//             // Delete old image if it exists
//             if (service.imagePath && fs.existsSync(service.imagePath)) {
//                 try {
//                     fs.unlinkSync(service.imagePath);
//                     console.log('Old service image deleted:', service.imagePath);
//                 } catch (deleteError) {
//                     console.error('Error deleting old service image:', deleteError);
//                 }
//             }

//             // Store the new image path
//             const fullPath = path.join(process.cwd(), 'uploads', 'service-images', uploadedFile.filename);
//             service.imagePath = fullPath;
//         }

//         await service.save();

//         return res.status(200).json({
//             message: "Service updated successfully",
//             service: {
//                 id: service._id,
//                 heading: service.heading,
//                 description: service.description,
//                 category: service.category,
//                 imagePath: service.imagePath,
//                 tags: service.tags,
//                 externalUrl: service.externalUrl,
//                 featured: service.featured,
//                 displayOrder: service.displayOrder,
//                 isActive: service.isActive,
//                 hasImage: service.hasImage
//             }
//         });

//     } catch (error) {
//         console.error("Service update error:", error);
//         return res.status(500).json({
//             error: "Internal server error",
//             details: error.message
//         });
//     }
// };

// // Get all services
// export const getAllServices = async (req, res) => {
//     try {
//         const { category, featured, isActive } = req.query;
//         const filter = {};

//         if (category) filter.category = category;
//         if (featured !== undefined) filter.featured = featured === 'true';
//         if (isActive !== undefined) filter.isActive = isActive === 'true';

//         const services = await Service.find(filter).sort({ displayOrder: 1, createdAt: -1 });

//         return res.status(200).json({
//             message: "Services retrieved successfully",
//             services: services.map(service => ({
//                 id: service._id,
//                 heading: service.heading,
//                 description: service.description,
//                 category: service.category,
//                 imagePath: service.imagePath,
//                 tags: service.tags,
//                 externalUrl: service.externalUrl,
//                 featured: service.featured,
//                 displayOrder: service.displayOrder,
//                 isActive: service.isActive,
//                 hasImage: service.hasImage,
//                 createdAt: service.createdAt,
//                 updatedAt: service.updatedAt
//             }))
//         });

//     } catch (error) {
//         console.error("Get services error:", error);
//         return res.status(500).json({
//             error: "Internal server error",
//             details: error.message
//         });
//     }
// };

// // Get service by ID
// export const getServiceById = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const service = await Service.findById(id);
//         if (!service) {
//             return res.status(404).json({ error: "Service not found" });
//         }

//         return res.status(200).json({
//             message: "Service retrieved successfully",
//             service: {
//                 id: service._id,
//                 heading: service.heading,
//                 description: service.description,
//                 category: service.category,
//                 imagePath: service.imagePath,
//                 tags: service.tags,
//                 externalUrl: service.externalUrl,
//                 featured: service.featured,
//                 displayOrder: service.displayOrder,
//                 isActive: service.isActive,
//                 hasImage: service.hasImage,
//                 createdAt: service.createdAt,
//                 updatedAt: service.updatedAt
//             }
//         });

//     } catch (error) {
//         console.error("Get service error:", error);
//         return res.status(500).json({
//             error: "Internal server error",
//             details: error.message
//         });
//     }
// };

// // Delete service
// export const deleteService = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const service = await Service.findById(id);
//         if (!service) {
//             return res.status(404).json({ error: "Service not found" });
//         }

//         // Delete associated image if it exists
//         if (service.imagePath && fs.existsSync(service.imagePath)) {
//             try {
//                 fs.unlinkSync(service.imagePath);
//                 console.log('Service image deleted:', service.imagePath);
//             } catch (deleteError) {
//                 console.error('Error deleting service image:', deleteError);
//             }
//         }

//         await Service.findByIdAndDelete(id);

//         return res.status(200).json({
//             message: "Service deleted successfully"
//         });

//     } catch (error) {
//         console.error("Delete service error:", error);
//         return res.status(500).json({
//             error: "Internal server error",
//             details: error.message
//         });
//     }
// };

// // Remove service image only
// export const removeServiceImage = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const service = await Service.findById(id);
//         if (!service) {
//             return res.status(404).json({ error: "Service not found" });
//         }

//         if (service.imagePath && fs.existsSync(service.imagePath)) {
//             try {
//                 fs.unlinkSync(service.imagePath);
//                 console.log('Service image deleted:', service.imagePath);
//             } catch (deleteError) {
//                 console.error('Error deleting service image:', deleteError);
//             }
//         }

//         service.imagePath = null;
//         await service.save();

//         return res.status(200).json({
//             message: "Service image removed successfully",
//             service: {
//                 id: service._id,
//                 heading: service.heading,
//                 description: service.description,
//                 category: service.category,
//                 imagePath: service.imagePath,
//                 hasImage: service.hasImage
//             }
//         });

//     } catch (error) {
//         console.error("Remove service image error:", error);
//         return res.status(500).json({
//             error: "Internal server error",
//             details: error.message
//         });
//     }
// };


import Service from '../models/services.model.js';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';

// // Configure multer for local storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(process.cwd(), 'uploads', 'service-images');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = crypto.randomBytes(8).toString('hex');
//     const ext = path.extname(file.originalname);
//     cb(null, `service-${uniqueSuffix}${ext}`);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'), false);
//     }
//   }
// });

// export const uploadServiceImage = upload.single('image');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'service-images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'service-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Middleware to process both form data and files
export const processServiceForm = upload.single('image');

// export const createService = async (req, res) => {
//   try {
//     const { heading, description, isActive, displayOrder, category, tags, externalUrl, featured } = req.body;
//     if (!heading || !description || !category) {
//       return res.status(400).json({ success: false, error: 'Required fields missing' });
//     }

//     let imagePath = null;
//     if (req.file) {
//       imagePath = req.file.path;
//     }

//     const service = new Service({
//       heading,
//       description,
//       isActive: isActive === 'true' || isActive === true,
//       displayOrder: Number(displayOrder) || 0,
//       category,
//       tags,
//       externalUrl,
//       featured,
//       imagePath
//     });

//     await service.save();
//     res.status(201).json({ 
//       success: true, 
//       data: service,
//       message: 'Service created' 
//     });
//   } catch (err) {
//     console.error('Create service error:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };
export const createService = async (req, res) => {
  try {
    // Debug received data
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    // Parse form data (all fields come as strings)
    const { 
      heading,
      description,
      isActive,
      displayOrder,
      category,
      tags,
      externalUrl,
      featured
    } = req.body;

    if (!heading || !description || !category) {
      return res.status(400).json({ success: false, error: 'Required fields missing' });
    }

    // Process image if uploaded
    let imageData = {
      imagePath: null,
      imageUrl: null
    };

    if (req.file) {
      const fullPath = req.file.path;
      const webPath = `/uploads/service-images/${path.basename(fullPath)}`;
      
      imageData = {
        imagePath: fullPath.replace('\\','\\\\'),
        imageUrl: webPath
      };
    }

    // Convert string values to proper types
    const service = new Service({
      heading,
      description,
      isActive: isActive === 'true',
      displayOrder: parseInt(displayOrder) || 0,
      category,
      tags: typeof tags === 'string' ? tags.split(',') : tags || [],
      externalUrl: externalUrl || null,
      featured: featured === 'true',
      ...imageData
    });

    await service.save();
    
    res.status(201).json({
      success: true,
      data: {
        ...service.toObject(),
        imageUrl: imageData.imageUrl
      },
      message: 'Service created'
    });

  } catch (err) {
    console.error('Create service error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

export const updateService = async (req, res) => {
  try {
    let updateData = {
      heading: req.body.heading,
      description: req.body.description,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      displayOrder: Number(req.body.displayOrder) || 0,
      category: req.body.category,
      tags: req.body.tags,
      externalUrl: req.body.externalUrl,
      featured: req.body.featured === 'true' || req.body.featured === true
    };

    if (req.file) {
      const oldService = await Service.findById(req.params.id);
      // Delete old image if exists
      if (oldService?.imagePath && fs.existsSync(oldService.imagePath)) {
        fs.unlinkSync(oldService.imagePath);
      }
      updateData.imagePath = req.file.path;
    }

    const updated = await Service.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.json({ 
      success: true, 
      data: updated, 
      message: 'Service updated' 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    // Delete associated image
    if (service.imagePath && fs.existsSync(service.imagePath)) {
      fs.unlinkSync(service.imagePath);
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getActiveServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort('displayOrder').limit(Number(req.query.limit) || 10);
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getServiceStats = async (req, res) => {
  try {
    const total = await Service.countDocuments();
    const active = await Service.countDocuments({ isActive: true });
    res.json({ success: true, data: { total, active, inactive: total - active } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const { activeOnly, sort = 'displayOrder', limit = 10, skip = 0 } = req.query;
    const filter = activeOnly === 'true' ? { isActive: true } : {};

    const services = await Service.find(filter)
      .sort(sort)
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Service.countDocuments(filter);
    res.json({ success: true, count: services.length, total, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Keep all other controller methods (getAllServices, getServiceById, etc.) the same
// Just remove any GridFS-specific code