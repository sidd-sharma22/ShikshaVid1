const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Teacher = require('../models/Teacher');
const { protect } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Submit a review
router.post('/', protect, async (req, res) => {
  try {
    const { teacherId, rating, comment } = req.body;

    // Verify teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ 
      studentId: req.user._id, 
      teacherId 
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this teacher' });
    }

    const review = await Review.create({
      studentId: req.user._id,
      teacherId,
      rating,
      comment
    });

    await review.populate('studentId', 'name avatar');

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/teacher/:teacherId
// @desc    Get reviews for a teacher
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      teacherId: req.params.teacherId,
      isApproved: true 
    })
      .populate('studentId', 'name avatar')
      .sort('-createdAt');

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
