import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
    enum: ['mission', 'vision', 'history', 'team', 'values']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: String,
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const AboutUs = mongoose.model('AboutUs', aboutUsSchema);