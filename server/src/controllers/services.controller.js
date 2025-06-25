// src/controllers/services.controller.js
import Service from '../models/services.model.js';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import crypto from 'crypto';
import path from "path";
import mongoose from 'mongoose';

let servicesGridFSBucket;

export const initializeServicesGridFS = async (mongoUri) => {
  try {
    const client = await MongoClient.connect(mongoUri, { useUnifiedTopology: true });
    servicesGridFSBucket = new GridFSBucket(client.db(), { bucketName: 'service_images' });
    console.log('Service GridFS initialized');
  } catch (err) {
    console.error('GridFS init error:', err);
    throw err;
  }
};

const uploadServiceImageToGridFS = (fileBuffer, originalName, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!servicesGridFSBucket) return reject(new Error('GridFS not initialized'));

    const filename = crypto.randomBytes(16).toString('hex') + path.extname(originalName);
    const stream = servicesGridFSBucket.openUploadStream(filename, {
      metadata: { originalName, mimetype, uploadDate: new Date(), type: 'service_image' }
    });

    stream.end(fileBuffer);
    stream.on('finish', () => resolve({ fileId: stream.id.toString(), filename }));
    stream.on('error', reject);
  });
};

export const createService = async (req, res) => {
  try {
    const { heading, description, isActive, displayOrder, category, tags, externalUrl, featured } = req.body;
    if (!heading || !description || !category) {
      return res.status(400).json({ success: false, error: 'Required fields missing' });
    }

    let imageData = {};
    if (req.file) {
      try {
        const result = await uploadServiceImageToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype);
        imageData = {
          imageId: result.fileId,
          imageUrl: `/api/v1/services/image/${result.fileId}`
        };
      } catch (e) {
        console.error('Image upload failed:', e);
      }
    }

    const service = new Service({
      heading,
      description,
      isActive: isActive === 'true' || isActive === true,
      displayOrder: Number(displayOrder) || 0,
      category,
      tags,
      externalUrl,
      featured,
      ...imageData
    });

    await service.save();
    res.status(201).json({ success: true, data: service, message: 'Service created' });
  } catch (err) {
    console.error('Create service error:', err);
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

export const getServiceImage = async (req, res) => {
  try {
    if (!servicesGridFSBucket) return res.status(500).json({ error: 'GridFS not initialized' });
    const imageId = new ObjectId(req.params.imageId);
    const [file] = await servicesGridFSBucket.find({ _id: imageId }).toArray();
    if (!file) return res.status(404).json({ error: 'Image not found' });

    res.set({
      'Content-Type': file.metadata?.mimetype || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000'
    });
    servicesGridFSBucket.openDownloadStream(imageId).pipe(res);
  } catch (err) {
    console.error('Get image error:', err);
    if (!res.headersSent) res.status(500).json({ error: 'Server error' });
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
      if (oldService?.imageId) {
        try { await servicesGridFSBucket.delete(new ObjectId(oldService.imageId)); } catch (e) {}
      }

      const result = await uploadServiceImageToGridFS(req.file.buffer, req.file.originalname, req.file.mimetype);
      updateData.imageId = result.fileId;
      updateData.imageUrl = `/api/v1/services/image/${result.fileId}`;
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Service not found' });

    res.json({ success: true, data: updated, message: 'Service updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
    if (service.imageId) {
      try { await servicesGridFSBucket.delete(new ObjectId(service.imageId)); } catch (e) {}
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
