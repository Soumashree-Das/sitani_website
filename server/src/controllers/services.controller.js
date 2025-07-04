import Service from '../models/services.model.js';
import { serviceImageUpload } from '../middlewares/fileUpload.middleware.js';
import path from "path";

// Controller methods
export const createService = async (req, res) => {
  try {
    // Use the upload middleware first

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

      // console.log(req.body);

      if (!heading) {
        return res.status(400).json({ 
          success: false, 
          error: 'Heading Required!' 
        });
      }

      if (!description) {
        return res.status(400).json({ 
          success: false, 
          error: 'description Required!' 
        });
      }

      // Process image if uploaded
      let imageData = {
        imagePath: null,
        // imageUrl: null
      };

      if (req.file) {
        // const webPath = `/uploads/service-images/${path.basename(req.file.filename)}`;
        imageData = {
          imagePath: path.join(process.cwd(),'uploads','service-images',req.file.filename)
        };
      }

      // Create service
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
import fs from "fs";
export const updateService = async (req, res) => {
  try {

      let updateData = {
        heading: req.body.heading,
        description: req.body.description,
        isActive: req.body.isActive === 'true',
        displayOrder: Number(req.body.displayOrder) || 0,
        category: req.body.category,
        tags: typeof req.body.tags === 'string' ? req.body.tags.split(',') : req.body.tags || [],
        externalUrl: req.body.externalUrl,
        featured: req.body.featured === 'true'
      };

      if (req.file) {
        const oldService = await Service.findById(req.params.id);
        // Delete old image if exists
        if (oldService?.imagePath && fs.existsSync(oldService.imagePath)) {
          fs.unlinkSync(oldService.imagePath);
        }
        
        const webPath = `/uploads/service-images/${path.basename(req.file.filename)}`;
        updateData.imagePath = path.join(process.cwd(),'uploads','service-images',req.file.filename);
        updateData.imageUrl = webPath;
      }

      const updated = await Service.findByIdAndUpdate(
        req.params.id, 
        updateData, 
        { new: true, runValidators: true }
      );
      
      if (!updated) {
        return res.status(404).json({ 
          success: false, 
          error: 'Service not found' 
        });
      }

      res.json({ 
        success: true, 
        data: updated, 
        message: 'Service updated' 
      });
    
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Keep all other controller methods the same as in your last version
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