
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

// export const updateProject = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Fetch existing project
//     const project = await Project.findById(id);
//     if (!project) {
//       return res.status(404).json({ success: false, error: 'Project not found' });
//     }

//     // Remove old images
//     project.images.forEach(imgPath => {
//       const fullPath = path.join(__dirname, '..', imgPath);
//       if (fs.existsSync(fullPath)) {
//         try {
//           fs.unlinkSync(fullPath);
//           // console.log(`Deleted old image: ${fullPath}`);
//         } catch (error) {
//           console.error(`Error deleting image ${fullPath}:`, error);
//         }
//       }
//     });

//     // Remove old videos
//     project.videos.forEach(videoPath => {
//       const fullPath = path.join(__dirname, '..', videoPath);
//       if (fs.existsSync(fullPath)) {
//         try {
//           fs.unlinkSync(fullPath);
//           // console.log(`Deleted old video: ${fullPath}`);
//         } catch (error) {
//           console.error(`Error deleting video ${fullPath}:`, error);
//         }
//       }
//     });

//     // Prepare new file paths - FIXED: videos now go to correct directory
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

//     // Parse other potential JSON fields
//     const jsonFields = ['technologies', 'features', 'challenges'];
//     jsonFields.forEach(field => {
//       if (typeof updateData[field] === 'string') {
//         try {
//           updateData[field] = JSON.parse(updateData[field]);
//         } catch (e) {
//           console.warn(`Invalid ${field} JSON, keeping as string:`, updateData[field]);
//         }
//       }
//     });

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

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    /* 1️⃣  Load existing project */
    const project = await Project.findById(id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    /* 2️⃣  Determine media‑handling mode */
    const {
      imageOption = req.files?.images?.length ? "replace" : "keep",
      videoOption = req.files?.videos?.length ? "replace" : "keep",
    } = req.body; // explicit override possible

    /* 3️⃣  Build new media arrays */
    const newImagePaths =
      req.files?.images?.map((f) => `/uploads/project-media/${f.filename}`) ||
      [];
    const newVideoPaths =
      req.files?.videos?.map((f) => `/uploads/project-media/${f.filename}`) ||
      [];

    // helper to delete physical files
    const removeFiles = (paths) => {
      paths.forEach((p) => {
        const full = path.join(path.resolve(), p); // adjust if needed
        if (fs.existsSync(full)) {
          try {
            fs.unlinkSync(full);
          } catch (err) {
            console.error("Failed to delete:", full, err);
          }
        }
      });
    };

    let finalImages = project.images;
    let finalVideos = project.videos;

    /* 4️⃣  Images */
    if (imageOption === "replace") {
      removeFiles(project.images);
      finalImages = newImagePaths;
    } else if (imageOption === "append") {
      finalImages = [...project.images, ...newImagePaths];
    } // keep → nothing to do

    /* 5️⃣  Videos */
    if (videoOption === "replace") {
      removeFiles(project.videos);
      finalVideos = newVideoPaths;
    } else if (videoOption === "append") {
      finalVideos = [...project.videos, ...newVideoPaths];
    }

    /* 6️⃣  Assemble update payload */
    const updateData = {
      ...req.body,
      images: finalImages,
      videos: finalVideos,
    };

    // parse JSONish fields if needed
    if (typeof updateData.teamMembers === "string") {
      try {
        updateData.teamMembers = JSON.parse(updateData.teamMembers);
      } catch {
        return res
          .status(400)
          .json({ success: false, error: "Invalid teamMembers JSON" });
      }
    }

    ["technologies", "features", "challenges"].forEach((f) => {
      if (typeof updateData[f] === "string") {
        try {
          updateData[f] = JSON.parse(updateData[f]);
        } catch {
          /* leave as string */
        }
      }
    });

    /* 7️⃣  Save */
    const updated = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Project updated",
      data: updated,
    });
  } catch (err) {
    console.error("Update error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: Object.values(err.errors).map((e) => e.message),
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
          // console.log(`Deleted file: ${fullPath}`);
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

// Serve actual image file
export const serveProjectImage = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', 'project-media', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'Image not found' });
  }

  res.sendFile(filePath);
};

// Serve actual video file
export const serveProjectVideo = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', 'project-media', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'Video not found' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // Stream partial content for video
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    file.pipe(res);
  } else {
    // Send entire video
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(filePath).pipe(res);
  }
};
