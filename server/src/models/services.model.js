// // import mongoose from "mongoose";

// // const serviceSchema = new mongoose.Schema({
// //   heading: {
// //     type: String,
// //     // required: true,
// //     trim: true
// //   },
// //   description: {
// //     type: String,
// //     required: true,
// //     trim: true
// //   },
// //   isActive: {
// //     type: Boolean,
// //     default: true
// //   },
// //   displayOrder: {
// //     type: Number,
// //     default: 0
// //   },
// //   imageUrl: {
// //     type: String 
// //   },
// //   imageId: {
// //     type: String 
// //   },
// //   category: {
// //     type: String,
// //     enum: ['consulting', 'development', 'design', 'training', 'support', 'other'],
// //     required: true
// //   },
// //   tags: [{
// //     type: String,
// //     trim: true
// //   }],
// //   externalUrl: {
// //     type: String,
// //     trim: true
// //   },
// //   featured: {
// //     type: Boolean,
// //     default: false
// //   }
// // }, { 
// //   timestamps: true,
// //   toJSON: { virtuals: true },
// //   toObject: { virtuals: true }
// // });

// // // Virtual for service URL
// // serviceSchema.virtual('url').get(function() {
// //   return `/services/${this._id}`;
// // });

// // // Virtual for hasImage
// // serviceSchema.virtual('hasImage').get(function() {
// //   return !!(this.imageId && this.imageUrl);
// // });

// // // Virtual for short description (first 100 characters)
// // serviceSchema.virtual('shortDescription').get(function() {
// //   return this.description.length > 100 
// //     ? this.description.substring(0, 100) + '...' 
// //     : this.description;
// // });

// // // Indexes for better query performance
// // serviceSchema.index({ heading: 'text', description: 'text' });
// // serviceSchema.index({ isActive: 1 });
// // serviceSchema.index({ displayOrder: 1 });
// // serviceSchema.index({ category: 1 });
// // serviceSchema.index({ featured: 1 });
// // serviceSchema.index({ tags: 1 });

// // const Service = mongoose.model('Service', serviceSchema);
// // export default Service;


// import mongoose from "mongoose";

// const serviceSchema = new mongoose.Schema({
//   heading: {
//     type: String,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   displayOrder: {
//     type: Number,
//     default: 0
//   },
//   imagePath: {  // Changed from imageUrl/imageId to store local path
//     type: String ,
//     default:null
//   },
//   category: {
//     type: String,
//     enum: ['consulting', 'development', 'design', 'training', 'support', 'other'],
//     required: true
//   },
//   tags: [{
//     type: String,
//     trim: true
//   }],
//   externalUrl: {
//     type: String,
//     trim: true
//   },
//   featured: {
//     type: Boolean,
//     default: false
//   }
// }, { 
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes remain the same
// serviceSchema.index({ heading: 'text', description: 'text' });
// serviceSchema.index({ isActive: 1 });
// serviceSchema.index({ displayOrder: 1 });
// serviceSchema.index({ category: 1 });
// serviceSchema.index({ featured: 1 });
// serviceSchema.index({ tags: 1 });

// const Service = mongoose.model('Service', serviceSchema);
// export default Service;
import mongoose from "mongoose";
import path from "path";

const serviceSchema = new mongoose.Schema({
  heading: {
    type: String,
    trim: true
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
    type: String,
    enum: ['consulting', 'development', 'design', 'training', 'support', 'other'],
    required: true
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