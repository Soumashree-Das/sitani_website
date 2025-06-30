import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  dateAchieved: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: true,
    enum: ['award', 'milestone', 'certification', 'other']
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, { 
  timestamps: true 
});

export const Achievement = mongoose.model('Achievement', achievementSchema);