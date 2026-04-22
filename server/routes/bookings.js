const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Lead = require('../models/Lead');
const { protect, authorize } = require('../middleware/auth');
const { sendEmail, bookingConfirmationStudent, bookingNotificationTeacher } = require('../utils/email');

// @route   POST /api/bookings
// @desc    Book a demo class
router.post('/', protect, async (req, res) => {
  try {
    const { teacherId, date, time, subject, notes, studentPhone } = req.body;

    // Verify teacher exists
    const teacher = await Teacher.findById(teacherId).populate('userId', 'name email');
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    // Create booking
    const booking = await Booking.create({
      studentId: req.user._id,
      teacherId,
      date,
      time,
      subject,
      notes,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentPhone: studentPhone || req.user.phone
    });

    // Track lead
    await Lead.create({
      studentId: req.user._id,
      teacherId,
      type: 'booking'
    });

    // Increment teacher's booking count
    await Teacher.findByIdAndUpdate(teacherId, {
      $inc: { demoBookings: 1, totalLeads: 1 }
    });

    // Send email notifications (non-blocking)
    const dateStr = new Date(date).toLocaleDateString('en-IN', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    // Student confirmation
    const studentEmail = bookingConfirmationStudent(
      req.user.name, teacher.userId.name, dateStr, time, subject
    );
    sendEmail({ to: req.user.email, ...studentEmail }).catch(console.error);

    // Teacher notification
    const teacherEmail = bookingNotificationTeacher(
      teacher.userId.name, req.user.name, dateStr, time, subject
    );
    sendEmail({ to: teacher.userId.email, ...teacherEmail }).catch(console.error);

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get student's bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.user._id })
      .populate({
        path: 'teacherId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort('-createdAt');

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/bookings/teacher-bookings
// @desc    Get teacher's bookings
router.get('/teacher-bookings', protect, authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const bookings = await Booking.find({ teacherId: teacher._id })
      .populate('studentId', 'name email phone')
      .sort('-createdAt');

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
