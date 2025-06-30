import { Achievement } from "../models/acheivements.model.js";

export const createAchievement = async (req, res) => {
  try {
    // console.log('🔍 Request body:', req.body);
    // console.log('🔍 Request headers:', req.headers);
    // console.log('🔍 Content-Type:', req.get('Content-Type'));
    
    if (!req.body) {
      return res.status(400).json({ 
        success: false, 
        error: 'No request body received' 
      });
    }

    const achievement = new Achievement({
      ...req.body
    });
    
    await achievement.save();
    res.status(201).json({ success: true, data: achievement });
  } catch (err) {
    console.error('❌ Create achievement error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// GET Recent Achievements
export const getRecentAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort('-dateAchieved').limit(5);
    res.json({
      success: true,
      data: achievements 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET All Achievements with filters
export const getAllAchievements = async (req, res) => {
  try {
    const { category, featured, year, sort = '-dateAchieved', limit = 10, skip = 0, search } = req.query;
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

    const achievements = await Achievement.find(filter).sort(sort).limit(Number(limit)).skip(Number(skip));
    const total = await Achievement.countDocuments(filter);

    res.status(200).json({ success: true, count: achievements.length, total, data: achievements });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error: ' + err.message });
  }
};

// GET Achievement by ID
export const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ success: false, error: 'Achievement not found' });
    }
    res.json({ success: true, data: achievement });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// UPDATE Achievement
export const updateAchievement = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim());
    }

    const updated = await Achievement.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({
      success: true,
      data: updated,
      message: 'Achievement updated successfully'
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE Achievement
export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ success: false, error: 'Achievement not found' });
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Achievement deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET Featured Achievements
export const getFeaturedAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ featured: true }).sort('-dateAchieved').limit(Number(req.query.limit) || 10);
    res.json({ success: true, data: achievements });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET Achievements by Category
export const getAchievementsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    const achievements = await Achievement.find({ category }).sort('-dateAchieved').limit(Number(limit)).skip(Number(skip));
    const total = await Achievement.countDocuments({ category });

    res.json({ success: true, count: achievements.length, total, category, data: achievements });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET Achievement Statistics
export const getAchievementStats = async (req, res) => {
  try {
    const totalAchievements = await Achievement.countDocuments();
    const featuredAchievements = await Achievement.countDocuments({ featured: true });

    const categoryStats = await Achievement.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const yearStats = await Achievement.aggregate([
      { $group: { _id: { $year: '$dateAchieved' }, count: { $sum: 1 } } },
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
    res.status(500).json({ success: false, error: err.message });
  }
};
