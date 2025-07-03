import { Announcement } from "../models/news.model.js";


export const createAnnouncement = async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort('-publishDate');
    res.json({ success: true, data: announcements });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Option 1: Hard delete (completely remove from database)
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
    
    // Option 2: Soft delete (mark as inactive - preferred if you might need to restore)
    // const deletedAnnouncement = await Announcement.findByIdAndUpdate(
    //   id,
    //   { isActive: false },
    //   { new: true }
    // );

    if (!deletedAnnouncement) {
      return res.status(404).json({ 
        success: false, 
        error: 'Announcement not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Announcement deleted successfully',
      data: deletedAnnouncement 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedAnnouncement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedAnnouncement
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};