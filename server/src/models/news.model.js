import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export const Announcement = mongoose.model('Announcement', announcementSchema);