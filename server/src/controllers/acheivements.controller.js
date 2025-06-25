import { Achievement } from "../models/acheivements.model.js";
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import crypto from 'crypto';
import path from "path";

// Initialize GridFS (you'll need to call this in your main app)
let gridfsBucket;

export const initializeGridFS = async (mongoUri) => {
  try {
    const client = await MongoClient.connect(mongoUri, { 
      useUnifiedTopology: true 
    });
    
    const db = client.db();
    gridfsBucket = new GridFSBucket(db, { bucketName: 'achievement_images' });
    console.log('GridFS initialized for achievements');
    return gridfsBucket;
  } catch (err) {
    console.error('GridFS initialization error:', err);
    throw err;
  }
};

// Helper function to upload image to GridFS
const uploadImageToGridFS = async (fileBuffer, originalName, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!gridfsBucket) {
      return reject(new Error('GridFS not initialized'));
    }

    const filename = crypto.randomBytes(16).toString('hex') + path.extname(originalName);
    
    const uploadStream = gridfsBucket.openUploadStream(filename, {
      metadata: {
        originalName: originalName,
        mimetype: mimetype,
        uploadDate: new Date(),
        type: 'achievement_image'
      }
    });

    uploadStream.on('finish', () => {
      resolve({
        fileId: uploadStream.id.toString(),
        filename: filename
      });
    });

    uploadStream.on('error', (err) => {
      reject(err);
    });

    uploadStream.end(fileBuffer);
  });
};

// CREATE Achievement with Image
export const createAchievement = async (req, res) => {
  try {
    let imageData = {};
    
    // Handle image upload if present
    if (req.file) {
      const uploadResult = await uploadImageToGridFS(
        req.file.buffer, 
        req.file.originalname, 
        req.file.mimetype
      );
      
      imageData = {
        imageId: uploadResult.fileId,
        imageUrl: `/api/achievements/image/${uploadResult.fileId}`
      };
    }

    // Process tags if they exist
    let tags = [];
    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        tags = req.body.tags.split(',').map(t => t.trim());
      } else if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
      }
    }

    const achievement = new Achievement({
      ...req.body,
      ...imageData,
      tags: tags
    });

    await achievement.save();
    
    res.status(201).json({ 
      success: true, 
      data: achievement,
      message: 'Achievement created successfully'
    });
  } catch (err) {
    console.error('Create achievement error:', err);
    res.status(400).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// GET Recent Achievements
export const getRecentAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find()
      .sort('-dateAchieved')
      .limit(5);
    
    res.json({ 
      success: true, 
      data: achievements 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// GET All Achievements with filters
export const getAllAchievements = async (req, res) => {
  try {
    const { 
      category,
      featured,
      year,
      sort = '-dateAchieved',
      limit = 10,
      skip = 0,
      search
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (year) {
      filter.dateAchieved = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const achievements = await Achievement.find(filter)
      .sort(sort)
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Achievement.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: achievements.length,
      total,
      data: achievements
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};

// GET Achievement by ID
export const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      data: achievement
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// GET Image from GridFS (serves the actual image)
export const getAchievementImage = async (req, res) => {
  try {
    if (!gridfsBucket) {
      return res.status(500).json({ error: 'GridFS not initialized' });
    }

    const imageId = new ObjectId(req.params.imageId);
    
    // Get file info
    const fileInfo = await gridfsBucket.find({ _id: imageId }).toArray();
    
    if (!fileInfo || fileInfo.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const file = fileInfo[0];
    
    // Set appropriate headers
    res.set({
      'Content-Type': file.metadata?.mimetype || 'image/jpeg',
      'Content-Length': file.length,
      'Cache-Control': 'public, max-age=31536000'
    });

    // Create download stream
    const downloadStream = gridfsBucket.openDownloadStream(imageId);
    
    downloadStream.on('error', (err) => {
      console.error('Image download error:', err);
      if (!res.headersSent) {
        res.status(404).json({ error: 'Image not found' });
      }
    });

    downloadStream.pipe(res);

  } catch (err) {
    console.error('Get image error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

// GET Image as Base64 (decoded format)
export const getAchievementImageBase64 = async (req, res) => {
  try {
    if (!gridfsBucket) {
      return res.status(500).json({ error: 'GridFS not initialized' });
    }

    const imageId = new ObjectId(req.params.imageId);
    
    // Get file info
    const fileInfo = await gridfsBucket.find({ _id: imageId }).toArray();
    
    if (!fileInfo || fileInfo.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const file = fileInfo[0];
    
    // Create download stream and collect data
    const downloadStream = gridfsBucket.openDownloadStream(imageId);
    const chunks = [];
    
    downloadStream.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    downloadStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.metadata?.mimetype || 'image/jpeg'};base64,${base64}`;
      
      res.json({
        success: true,
        data: {
          imageId: imageId.toString(),
          filename: file.filename,
          originalName: file.metadata?.originalName,
          mimetype: file.metadata?.mimetype,
          size: file.length,
          base64: base64,
          dataUrl: dataUrl
        }
      });
    });
    
    downloadStream.on('error', (err) => {
      console.error('Image download error:', err);
      res.status(404).json({ error: 'Image not found' });
    });

  } catch (err) {
    console.error('Get image base64 error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE Achievement
export const updateAchievement = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle new image upload
    if (req.file) {
      const achievement = await Achievement.findById(req.params.id);
      
      // Delete old image if exists
      if (achievement && achievement.imageId && gridfsBucket) {
        try {
          await gridfsBucket.delete(new ObjectId(achievement.imageId));
        } catch (err) {
          console.log('Old image deletion failed:', err.message);
        }
      }
      
      // Upload new image
      const uploadResult = await uploadImageToGridFS(
        req.file.buffer, 
        req.file.originalname, 
        req.file.mimetype
      );
      
      updateData.imageId = uploadResult.fileId;
      updateData.imageUrl = `/api/achievements/image/${uploadResult.fileId}`;
    }

    // Process tags
    if (updateData.tags) {
      if (typeof updateData.tags === 'string') {
        updateData.tags = updateData.tags.split(',').map(t => t.trim());
      }
    }

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      data: achievement,
      message: 'Achievement updated successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// DELETE Achievement
export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    // Delete associated image from GridFS
    if (achievement.imageId && gridfsBucket) {
      try {
        await gridfsBucket.delete(new ObjectId(achievement.imageId));
      } catch (err) {
        console.log('Image deletion failed:', err.message);
      }
    }

    await Achievement.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Achievement and associated image deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// GET Featured Achievements
export const getFeaturedAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ featured: true })
      .sort('-dateAchieved')
      .limit(Number(req.query.limit) || 10);
    
    res.json({
      success: true,
      data: achievements
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// GET Achievements by Category
export const getAchievementsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    const achievements = await Achievement.find({ category })
      .sort('-dateAchieved')
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Achievement.countDocuments({ category });

    res.json({
      success: true,
      count: achievements.length,
      total,
      category,
      data: achievements
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// GET Achievement Statistics
export const getAchievementStats = async (req, res) => {
  try {
    const totalAchievements = await Achievement.countDocuments();
    const featuredAchievements = await Achievement.countDocuments({ featured: true });
    
    const categoryStats = await Achievement.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const yearStats = await Achievement.aggregate([
      {
        $group: {
          _id: { $year: '$dateAchieved' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalAchievements,
        featured: featuredAchievements,
        byCategory: categoryStats,
        byYear: yearStats
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

























// import { Achievement } from "../models/acheivements.model.js";

// export const createAchievement = async (req, res) => {
//   try {
//     const achievement = new Achievement({
//       ...req.body,
//       tags: req.body.tags.split(',').map(t => t.trim())
//     });
//     await achievement.save();
//     res.status(201).json({ success: true, data: achievement });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }
// };

// export const getRecentAchievements = async (req, res) => {
//   try {
//     const achievements = await Achievement.find()
//       .sort('-dateAchieved')
//       .limit(5);
//     res.json({ success: true, data: achievements });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// export const getAllAchievements = async (req, res) => {
//   try {
//     // 1. Extract query parameters
//     const { 
//       category,
//       featured,
//       year,
//       sort = '-dateAchieved',
//       limit = 10,
//       skip = 0,
//       search
//     } = req.query;

//     // 2. Build filter object
//     const filter = {};
//     if (category) filter.category = category;
//     if (featured) filter.featured = featured === 'true';
//     if (year) {
//       filter.dateAchieved = {
//         $gte: new Date(`${year}-01-01`),
//         $lte: new Date(`${year}-12-31`)
//       };
//     }
//     if (search) {
//       filter.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // 3. Query database
//     const achievements = await Achievement.find(filter)
//       .sort(sort)
//       .limit(Number(limit))
//       .skip(Number(skip));

//     // 4. Get total count
//     const total = await Achievement.countDocuments(filter);

//     res.status(200).json({
//       success: true,
//       count: achievements.length,
//       total,
//       data: achievements
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: 'Server Error: ' + err.message
//     });
//   }
// };
