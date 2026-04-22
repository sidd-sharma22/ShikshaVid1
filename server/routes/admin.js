const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Lead = require('../models/Lead');
const Contact = require('../models/Contact');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin role
router.use(protect, authorize('admin'));

// ==========================================
// DASHBOARD & ANALYTICS
// ==========================================

// @route   GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalStudents, totalTeachers, activeTeachers,
      totalBookings, pendingBookings, completedBookings,
      totalReviews, totalLeads, totalContacts,
      recentBookings, topTeachers
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      Teacher.countDocuments({ isApproved: true, isSuspended: false }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'completed' }),
      Review.countDocuments(),
      Lead.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Booking.find().populate('studentId', 'name email').populate({
        path: 'teacherId',
        populate: { path: 'userId', select: 'name' }
      }).sort('-createdAt').limit(5),
      Teacher.find().populate('userId', 'name').sort('-rating').limit(5)
    ]);

    // Revenue calculation (commission based)
    const enrolledTeachers = await Teacher.find({ enrolledStudents: { $gt: 0 } });
    const totalRevenue = enrolledTeachers.reduce((acc, t) => {
      return acc + (t.enrolledStudents * t.fees * 0.03); // 3% commission
    }, 0);

    // Lead stats this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthlyLeads = await Lead.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.json({
      success: true,
      dashboard: {
        users: { totalStudents, totalTeachers, activeTeachers },
        bookings: { total: totalBookings, pending: pendingBookings, completed: completedBookings },
        reviews: totalReviews,
        leads: { total: totalLeads, thisMonth: monthlyLeads },
        contacts: { unread: totalContacts },
        revenue: { total: Math.round(totalRevenue), currency: 'INR' },
        recentBookings,
        topTeachers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// TEACHER MANAGEMENT
// ==========================================

// @route   GET /api/admin/teachers
router.get('/teachers', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status === 'pending') query.isApproved = false;
    if (status === 'approved') query.isApproved = true;
    if (status === 'suspended') query.isSuspended = true;
    if (status === 'verified') query.isVerified = true;

    const teachers = await Teacher.find(query)
      .populate('userId', 'name email phone isActive')
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Teacher.countDocuments(query);

    res.json({ success: true, teachers, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/teachers/:id/approve
router.put('/teachers/:id/approve', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('userId', 'name email');
    res.json({ success: true, teacher, message: 'Teacher approved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/teachers/:id/reject
router.put('/teachers/:id/reject', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    ).populate('userId', 'name email');
    res.json({ success: true, teacher, message: 'Teacher rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/teachers/:id/verify
router.put('/teachers/:id/verify', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).populate('userId', 'name email');
    res.json({ success: true, teacher, message: 'Teacher verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/teachers/:id/suspend
router.put('/teachers/:id/suspend', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isSuspended: true },
      { new: true }
    ).populate('userId', 'name email');
    res.json({ success: true, teacher, message: 'Teacher suspended' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/teachers/:id/unsuspend
router.put('/teachers/:id/unsuspend', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isSuspended: false },
      { new: true }
    ).populate('userId', 'name email');
    res.json({ success: true, teacher, message: 'Teacher unsuspended' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/teachers/:id
router.put('/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');
    res.json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/teachers/:id
router.delete('/teachers/:id', async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Teacher removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// BOOKING MANAGEMENT
// ==========================================

// @route   GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('studentId', 'name email phone')
      .populate({
        path: 'teacherId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);
    res.json({ success: true, bookings, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/bookings/:id
router.put('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// REVIEW MANAGEMENT
// ==========================================

// @route   GET /api/admin/reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('studentId', 'name email')
      .populate({
        path: 'teacherId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/reviews/:id/approve
router.put('/reviews/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/reviews/:id
router.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      const teacherId = review.teacherId;
      await Review.findByIdAndDelete(req.params.id);
      await Review.calculateAverageRating(teacherId);
    }
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// LEAD TRACKING
// ==========================================

// @route   GET /api/admin/leads
router.get('/leads', async (req, res) => {
  try {
    const { teacherId, type, page = 1, limit = 50 } = req.query;
    let query = {};
    if (teacherId) query.teacherId = teacherId;
    if (type) query.type = type;

    const leads = await Lead.find(query)
      .populate('studentId', 'name email')
      .populate({
        path: 'teacherId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Lead.countDocuments(query);

    // Aggregate leads per teacher
    const leadsPerTeacher = await Lead.aggregate([
      { $group: { _id: '$teacherId', total: { $sum: 1 }, types: { $push: '$type' } } }
    ]);

    res.json({ success: true, leads, total, leadsPerTeacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ENROLLMENT & COMMISSION
// ==========================================

// @route   PUT /api/admin/teachers/:id/enrollment
router.put('/teachers/:id/enrollment', async (req, res) => {
  try {
    const { enrolledStudents } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { enrolledStudents },
      { new: true }
    ).populate('userId', 'name');

    const commission = teacher.enrolledStudents * teacher.fees * 0.03;

    res.json({ 
      success: true, 
      teacher, 
      commission: { amount: Math.round(commission), rate: '3%' } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/revenue
router.get('/revenue', async (req, res) => {
  try {
    const teachers = await Teacher.find({ enrolledStudents: { $gt: 0 } })
      .populate('userId', 'name');

    const revenueData = teachers.map(t => ({
      teacherId: t._id,
      teacherName: t.userId?.name,
      enrolledStudents: t.enrolledStudents,
      fees: t.fees,
      commission: Math.round(t.enrolledStudents * t.fees * 0.03),
      commissionRate: '3%'
    }));

    const totalRevenue = revenueData.reduce((acc, r) => acc + r.commission, 0);

    res.json({ success: true, revenueData, totalRevenue, currency: 'INR' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// CONTACT/SUPPORT MANAGEMENT
// ==========================================

// @route   GET /api/admin/contacts
router.get('/contacts', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query).sort('-createdAt');
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/contacts/:id
router.put('/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// USER MANAGEMENT
// ==========================================

// @route   GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) query.role = role;

    const users = await User.find(query).select('-password').sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/toggle-active
router.put('/users/:id/toggle-active', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user: { id: user._id, name: user.name, isActive: user.isActive } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
