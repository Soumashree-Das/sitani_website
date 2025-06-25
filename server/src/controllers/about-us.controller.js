import { AboutUs } from "../models/aboutUs.model.js";

export const updateAboutSection = async (req, res) => {
  try {
    const section = await AboutUs.findOneAndUpdate(
      { section: req.params.section },
      req.body,
      { new: true, upsert: true }
    );
    res.json({ success: true, data: section });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getAboutContent = async (req, res) => {
  try {
    const content = await AboutUs.find({ isActive: true })
      .sort('displayOrder');
    res.json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createAboutInfo = async (req, res) => {
  try {
    // Validate required fields
    const { section, title, content } = req.body;
    if (!section || !title || !content) {
      return res.status(400).json({
        success: false,
        error: "Section, title, and content are required fields"
      });
    }

    // Create new about entry
    const aboutInfo = new AboutUs({
      section: section.toLowerCase(),
      title,
      content,
      imageUrl: req.file?.path || null, // If using file upload
      displayOrder: req.body.displayOrder || 0,
      isActive: req.body.isActive !== 'false' // Defaults to true
    });

    await aboutInfo.save();

    res.status(201).json({
      success: true,
      message: "About section created successfully",
      data: aboutInfo
    });

  } catch (err) {
    // Handle duplicate section error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "This section already exists"
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: errors
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error: " + err.message
    });
  }
};