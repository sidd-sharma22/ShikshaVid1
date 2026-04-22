const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  subjects: [{
    type: String,
    required: true,
    trim: true
  }],
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
    min: 0
  },
  fees: {
    type: Number,
    required: [true, 'Please provide monthly fees'],
    min: 0
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    }
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  qualifications: [{
    type: String,
    trim: true
  }],
  demoVideoUrl: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  teachingMode: {
    type: String,
    enum: ['offline', 'online', 'both'],
    default: 'offline'
  },
  languages: [{
    type: String,
    trim: true
  }],
  availableSlots: [{
    day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    startTime: String,
    endTime: String
  }],
  // Lead tracking
  totalLeads: { type: Number, default: 0 },
  callClicks: { type: Number, default: 0 },
  whatsappClicks: { type: Number, default: 0 },
  demoBookings: { type: Number, default: 0 },
  enrolledStudents: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create 2dsphere index for geo queries
teacherSchema.index({ 'location': '2dsphere' });

// Virtual to populate user data
teacherSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

teacherSchema.set('toJSON', { virtuals: true });
teacherSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Teacher', teacherSchema);
