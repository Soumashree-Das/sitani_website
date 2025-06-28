import { Project } from "../models/project.model.js";

export const createProject = async (req, res) => {
  try {
       const project = new Project({
      ...req.body
    });
    
    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// export const createProject = async (req, res) => {
//   try {
//     const project = new Project({
//       ...req.body
//       // technologies field is completely removed
//     });
    
//     await project.save();
//     res.status(201).json({ success: true, data: project });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }
// };

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
    
    // Prepare update data
    const updateData = {
      ...req.body,
      // Convert comma-separated string to array if technologies exists
      ...(req.body.technologies && { 
        technologies: typeof req.body.technologies === 'string' 
        ? req.body.technologies.split(',').map(t => t.trim())
        : [] // default to empty array if not a string
      })
    };

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,       // Return the updated document
        runValidators: true  // Run schema validators on update
      }
    );

    if (!updatedProject) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Project updated successfully',
      data: updatedProject 
    });

  } catch (err) {
    // Handle validation errors separately
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        error: Object.values(err.errors).map(e => e.message) 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    // 1. Extract query parameters for filtering/sorting
    const { 
      status, 
      featured, 
      sort = '-createdAt', 
      limit = 10,
      skip = 0 
    } = req.query;

    // 2. Build the filter object
    const filter = {};
    if (status) filter.status = status;
    if (featured) filter.featured = featured === 'true';

    // 3. Query the database
    const projects = await Project.find(filter)
      .sort(sort)
      .limit(Number(limit))
      .skip(Number(skip));

    // 4. Get total count for pagination
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