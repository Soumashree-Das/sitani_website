import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dateAchieved: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    enum: ['award', 'milestone', 'certification', 'other'],
    required: true
  },
  issuer: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String // URL to retrieve the image
  },
  imageId: {
    type: String // GridFS ObjectId for the image
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted date
achievementSchema.virtual('formattedDate').get(function() {
  return this.dateAchieved.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for hasImage
achievementSchema.virtual('hasImage').get(function() {
  return !!(this.imageId && this.imageUrl);
});

// Index for better query performance
achievementSchema.index({ dateAchieved: -1 });
achievementSchema.index({ category: 1 });
achievementSchema.index({ featured: 1 });
achievementSchema.index({ tags: 1 });
achievementSchema.index({ title: 'text', description: 'text' });

export const Achievement = mongoose.model('Achievement', achievementSchema);
