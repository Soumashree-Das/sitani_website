import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed', 'on-hold'],
    default: 'planned'
  },
  technologies: [String],
  projectUrl: String,
  repositoryUrl: String,
  featured: {
    type: Boolean,
    default: false
  },
  teamMembers: [{
    name: String,
    role: String
  }]
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);