const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide a booking date']
  },
  time: {
    type: String,
    required: [true, 'Please provide a booking time']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  subject: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  studentName: String,
  studentEmail: String,
  studentPhone: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.index({ studentId: 1, teacherId: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
