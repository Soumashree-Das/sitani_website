import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  heading: {
    type: String,
    // required: true,
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
  imageUrl: {
    type: String // URL to retrieve the image
  },
  imageId: {
    type: String // GridFS ObjectId for the image
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

// Virtual for service URL
serviceSchema.virtual('url').get(function() {
  return `/services/${this._id}`;
});

// Virtual for hasImage
serviceSchema.virtual('hasImage').get(function() {
  return !!(this.imageId && this.imageUrl);
});

// Virtual for short description (first 100 characters)
serviceSchema.virtual('shortDescription').get(function() {
  return this.description.length > 100 
    ? this.description.substring(0, 100) + '...' 
    : this.description;
});

// Indexes for better query performance
serviceSchema.index({ heading: 'text', description: 'text' });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ displayOrder: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ featured: 1 });
serviceSchema.index({ tags: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;


// import mongoose from "mongoose";

// const serviceSchema = new mongoose.Schema({
//     heading: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     isActive: {
//         type: Boolean,
//         default: true
//     },
//     displayOrder: {
//         type: Number,
//         default: 0
//     }
//     // images: [{
//     //     url: [String,""],
//     //     thumbnailUrl: String,
//     //     altText: String,
//     //     dimensions: { width: Number, height: Number }
//     // }]
//     // videos: [{
//     //   url: String,
//     //   thumbnailUrl: String,
//     //   duration: Number,
//     //   platform: String // 'youtube', 'vimeo', 'self-hosted'
//     // }]
// }, { timestamps: true });

// // // Virtual for service URL
// // serviceSchema.virtual('url').get(function () {
// //     return `/services/${this._id}`;
// // });

// const Service = mongoose.model('Service', serviceSchema);
// export default Service;