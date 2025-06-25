import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    enum: ['sales', 'support', 'technical', 'billing', 'other']
  },
  contactPerson: {
    name: { type: String, required: true },
    position: String,
    email: { type: String, required: true },
    phone: String
  },
  location: {
    address: String,
    city: String,
    country: String,
    timezone: String
  },
  availableHours: {
    weekdays: {
      from: { type: String, default: '09:00' },
      to: { type: String, default: '17:00' }
    },
    weekends: {
      from: String,
      to: String
    }
  },
  preferredContactMethods: [{
    type: String,
    enum: ['email', 'phone', 'whatsapp', 'in-person']
  }],
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);