import mongoose from "mongoose";
import path from "path";

const serviceSchema = new mongoose.Schema({
  heading: {
    type: String,
    required:true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  imagePath: {  // Changed from imageUrl/imageId to store local path
    type: String 
  },
  category: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  externalUrl: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

serviceSchema.virtual('imageUrl').get(function() {
  if (!this.imagePath) return null;
  return `/uploads/service-images/${path.basename(this.imagePath)}`;
});

// Virtual for service URL
serviceSchema.virtual('url').get(function() {
  return `/services/${this._id}`;
});

// Virtual for hasImage
serviceSchema.virtual('hasImage').get(function() {
  return !!this.imagePath;
});

// Virtual for image URL
// serviceSchema.virtual('imageUrl').get(function() {
//   return this.imagePath ? `/uploads/service-images/${path.basename(this.imagePath)}` : null;
// });

// Indexes remain the same
serviceSchema.index({ heading: 'text', description: 'text' });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ displayOrder: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ featured: 1 });
serviceSchema.index({ tags: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;