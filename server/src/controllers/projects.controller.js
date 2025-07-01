// import { Project } from "../models/project.model.js";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from 'url';

// // Setup __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const createProject = async (req, res) => {
//   try {
//     const imagePaths = req.files?.images?.map(file => `/uploads/project-media/${file.filename}`) || [];
//     const videoPaths = req.files?.videos?.map(file => `/uploads/project-media/${file.filename}`) || [];

//     const project = new Project({
//       ...req.body,
//       images: imagePaths,
//       videos: videoPaths
//     });

//     await project.save();
//     res.status(201).json({ success: true, data: project });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }
// };

// export const getFeaturedProjects = async (req, res) => {
//   try {
//     const projects = await Project.find({ featured: true }).sort('-startDate');
//     res.json({ success: true, data: projects });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // keep the prev and new updates files all 
// // export const updateProject = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     // Handle uploaded files
// //     const imagePaths = req.files?.images?.map(file => `/uploads/project-media/${file.filename}`) || [];
// //     const videoPaths = req.files?.videos?.map(file => `/uploads/project-media/${file.filename}`) || [];

// //     // Prepare update data
// //     const updateData = {
// //       ...req.body,
// //     };

// //     // Handle JSON stringified fields from form-data
// //     if (typeof updateData.teamMembers === 'string') {
// //       try {
// //         updateData.teamMembers = JSON.parse(updateData.teamMembers);
// //       } catch (e) {
// //         return res.status(400).json({ success: false, error: 'Invalid teamMembers JSON' });
// //       }
// //     }

// //     // Merge media if needed
// //     const project = await Project.findById(id);
// //     if (!project) {
// //       return res.status(404).json({ success: false, error: 'Project not found' });
// //     }

// //     updateData.images = [...project.images, ...imagePaths];
// //     updateData.videos = [...project.videos, ...videoPaths];

// //     const updatedProject = await Project.findByIdAndUpdate(
// //       id,
// //       updateData,
// //       {
// //         new: true,
// //         runValidators: true
// //       }
// //     );

// //     res.json({
// //       success: true,
// //       message: 'Project updated successfully',
// //       data: updatedProject
// //     });

// //   } catch (err) {
// //     if (err.name === 'ValidationError') {
// //       return res.status(400).json({
// //         success: false,
// //         error: Object.values(err.errors).map(e => e.message)
// //       });
// //     }
// //     res.status(500).json({
// //       success: false,
// //       error: err.message
// //     });
// //   }
// // };

// // remove the previous files
// export const updateProject = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // DEBUG
//     console.log('BODY:', req.body);
//     console.log('FILES:', req.files);

//     // Fetch existing project
//     const project = await Project.findById(id);
//     if (!project) {
//       return res.status(404).json({ success: false, error: 'Project not found' });
//     }

//     // Remove old images
//     project.images.forEach(imgPath => {
//       const fullPath = path.join(__dirname, '..', imgPath); // e.g., /uploads/project-media/xyz.jpg
//       if (fs.existsSync(fullPath)) {
//         fs.unlinkSync(fullPath);
//       }
//     });

//     // Remove old videos
//     project.videos.forEach(videoPath => {
//       const fullPath = path.join(__dirname, '..', videoPath);
//       if (fs.existsSync(fullPath)) {
//         fs.unlinkSync(fullPath);
//       }
//     });

//     // Prepare new file paths
//     const imagePaths = req.files?.images?.map(file => `/uploads/project-media/${file.filename}`) || [];
//     const videoPaths = req.files?.videos?.map(file => `/uploads/project-media/${file.filename}`) || [];

//     // Prepare new update data
//     const updateData = {
//       ...req.body,
//       images: imagePaths,
//       videos: videoPaths
//     };

//     // Parse teamMembers if stringified
//     if (typeof updateData.teamMembers === 'string') {
//       try {
//         updateData.teamMembers = JSON.parse(updateData.teamMembers);
//       } catch (e) {
//         return res.status(400).json({ success: false, error: 'Invalid teamMembers JSON' });
//       }
//     }

//     // Update project in DB
//     const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true
//     });

//     res.json({
//       success: true,
//       message: 'Project updated successfully (media replaced)',
//       data: updatedProject
//     });

//   } catch (err) {
//     console.error('Update error:', err);
//     if (err.name === 'ValidationError') {
//       return res.status(400).json({
//         success: false,
//         error: Object.values(err.errors).map(e => e.message)
//       });
//     }
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


// export const getAllProjects = async (req, res) => {
//   try {
//     // 1. Extract query parameters for filtering/sorting
//     const { 
//       status, 
//       featured, 
//       sort = '-createdAt', 
//       limit = 10,
//       skip = 0 
//     } = req.query;

//     // 2. Build the filter object
//     const filter = {};
//     if (status) filter.status = status;
//     if (featured) filter.featured = featured === 'true';

//     // 3. Query the database
//     const projects = await Project.find(filter)
//       .sort(sort)
//       .limit(Number(limit))
//       .skip(Number(skip));

//     // 4. Get total count for pagination
//     const total = await Project.countDocuments(filter);

//     res.json({
//       success: true,
//       count: projects.length,
//       total,
//       data: projects
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: 'Server Error: ' + err.message
//     });
//   }
// };

// export const getProjectImages = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       return res.status(404).json({ success: false, error: 'Project not found' });
//     }
//     res.json({ success: true, images: project.images || [] });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Get project videos
// export const getProjectVideos = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       return res.status(404).json({ success: false, error: 'Project not found' });
//     }
//     res.json({ success: true, videos: project.videos || [] });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


import { Project } from "../models/project.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createProject = async (req, res) => {
  try {
    const imagePaths = req.files?.images?.map(file => `/uploads/project-media/${file.filename}`) || [];
    const videoPaths = req.files?.videos?.map(file => `/uploads/project-media/${file.filename}`) || [];

    const project = new Project({
      ...req.body,
      images: imagePaths,
      videos: videoPaths
    });

    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort('-startDate');
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    // DEBUG
    console.log('BODY:', req.body);
    console.log('FILES:', req.files);

    // Fetch existing project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Remove old images
    project.images.forEach(imgPath => {
      const fullPath = path.join(__dirname, '..', imgPath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`Deleted old image: ${fullPath}`);
        } catch (error) {
          console.error(`Error deleting image ${fullPath}:`, error);
        }
      }
    });

    // Remove old videos
    project.videos.forEach(videoPath => {
      const fullPath = path.join(__dirname, '..', videoPath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`Deleted old video: ${fullPath}`);
        } catch (error) {
          console.error(`Error deleting video ${fullPath}:`, error);
        }
      }
    });

    // Prepare new file paths - FIXED: videos now go to correct directory
    const imagePaths = req.files?.images?.map(file => `/uploads/project-media/${file.filename}`) || [];
    const videoPaths = req.files?.videos?.map(file => `/uploads/project-media/${file.filename}`) || [];

    // Prepare new update data
    const updateData = {
      ...req.body,
      images: imagePaths,
      videos: videoPaths
    };

    // Parse teamMembers if stringified
    if (typeof updateData.teamMembers === 'string') {
      try {
        updateData.teamMembers = JSON.parse(updateData.teamMembers);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid teamMembers JSON' });
      }
    }

    // Parse other potential JSON fields
    const jsonFields = ['technologies', 'features', 'challenges'];
    jsonFields.forEach(field => {
      if (typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          console.warn(`Invalid ${field} JSON, keeping as string:`, updateData[field]);
        }
      }
    });

    // Update project in DB
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Project updated successfully (media replaced)',
      data: updatedProject
    });

  } catch (err) {
    console.error('Update error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    // Extract query parameters for filtering/sorting
    const {
      status,
      featured,
      sort = '-createdAt',
      limit = 10,
      skip = 0,
      search
    } = req.query;

    // Build the filter object
    const filter = {};
    if (status) filter.status = status;
    if (featured) filter.featured = featured === 'true';

    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'teamMembers.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Query the database
    const projects = await Project.find(filter)
      .sort(sort)
      .limit(Number(limit))
      .skip(Number(skip));

    // Get total count for pagination
    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      count: projects.length,
      total,
      data: projects
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch project to get file paths before deletion
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Delete associated files
    [...project.images, ...project.videos].forEach(filePath => {
      const fullPath = path.join(__dirname, '..', filePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`Deleted file: ${fullPath}`);
        } catch (error) {
          console.error(`Error deleting file ${fullPath}:`, error);
        }
      }
    });

    // Delete project from database
    await Project.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Project and associated files deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getProjectImages = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, images: project.images || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getProjectVideos = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, videos: project.videos || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};




export const toggleProjectFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    project.featured = !project.featured;
    await project.save();

    res.json({
      success: true,
      message: `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`,
      data: project
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};