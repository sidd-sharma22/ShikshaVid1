const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { calculateBestFitScore } = require('../utils/scoring');

// @route   POST /api/teachers/profile
// @desc    Create teacher profile
router.post('/profile', protect, authorize('teacher'), async (req, res) => {
  try {
    // Check if profile already exists
    const existing = await Teacher.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Teacher profile already exists' });
    }

    const {
      subjects, experience, fees, location, bio,
      qualifications, demoVideoUrl, teachingMode, languages, availableSlots
    } = req.body;

    const teacher = await Teacher.create({
      userId: req.user._id,
      subjects,
      experience,
      fees,
      location,
      bio,
      qualifications,
      demoVideoUrl,
      teachingMode,
      languages,
      availableSlots
    });

    await teacher.populate('userId', 'name email phone');

    res.status(201).json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/teachers/profile
// @desc    Update teacher profile
router.put('/profile', protect, authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    res.json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/teachers/my-profile
// @desc    Get own teacher profile
router.get('/my-profile', protect, authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'No profile found. Please create one.' });
    }

    res.json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/teachers/search
// @desc    Search teachers with best-fit scoring
router.get('/search', async (req, res) => {
  try {
    const {
      lat, lng, subject, minExp, maxFees,
      minRating, maxDistance, sort, page = 1, limit = 20
    } = req.query;

    const userLat = parseFloat(lat) || 26.9124;  // Default: Jaipur
    const userLng = parseFloat(lng) || 75.7873;
    const maxDist = parseFloat(maxDistance) || 50;  // km

    // Build query
    let query = { isApproved: true, isSuspended: false };

    if (subject) {
      query.subjects = { $regex: subject, $options: 'i' };
    }
    if (minExp) {
      query.experience = { $gte: parseInt(minExp) };
    }
    if (maxFees) {
      query.fees = { $lte: parseInt(maxFees) };
    }
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Geo query - find within maxDistance km
    query['location'] = {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [userLng, userLat]
        },
        $maxDistance: maxDist * 1000 // convert to meters
      }
    };

    let teachers = await Teacher.find(query)
      .populate('userId', 'name email phone avatar')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Calculate best-fit score for each teacher
    const scoredTeachers = teachers.map(teacher => {
      const teacherObj = teacher.toObject();
      const scoring = calculateBestFitScore(teacherObj, userLat, userLng);
      return {
        ...teacherObj,
        bestFitScore: scoring.score,
        distance: scoring.distance,
        whyRecommended: scoring.reasons,
        scoreBreakdown: scoring.breakdown
      };
    });

    // Sort by best-fit score (default) or specified criteria
    if (sort === 'distance') {
      scoredTeachers.sort((a, b) => a.distance - b.distance);
    } else if (sort === 'fees') {
      scoredTeachers.sort((a, b) => a.fees - b.fees);
    } else if (sort === 'rating') {
      scoredTeachers.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'experience') {
      scoredTeachers.sort((a, b) => b.experience - a.experience);
    } else {
      scoredTeachers.sort((a, b) => b.bestFitScore - a.bestFitScore);
    }

    const total = await Teacher.countDocuments(query);

    res.json({
      success: true,
      count: scoredTeachers.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      teachers: scoredTeachers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/teachers/map
// @desc    Get teachers for map display
router.get('/map', async (req, res) => {
  try {
    const { lat, lng, radius = 30 } = req.query;
    const userLat = parseFloat(lat) || 26.9124;
    const userLng = parseFloat(lng) || 75.7873;

    const teachers = await Teacher.find({
      isApproved: true,
      isSuspended: false,
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [userLng, userLat] },
          $maxDistance: parseFloat(radius) * 1000
        }
      }
    }).populate('userId', 'name email phone avatar').select('userId subjects experience fees location rating isVerified');

    const markers = teachers.map(t => {
      const tObj = t.toObject();
      const scoring = calculateBestFitScore(tObj, userLat, userLng);
      return {
        _id: t._id,
        name: t.userId?.name || 'Teacher',
        subjects: t.subjects,
        experience: t.experience,
        fees: t.fees,
        rating: t.rating,
        isVerified: t.isVerified,
        distance: scoring.distance,
        lat: t.location.coordinates[1],
        lng: t.location.coordinates[0]
      };
    });

    res.json({ success: true, markers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/teachers/:id
// @desc    Get single teacher profile
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('userId', 'name email phone avatar');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/teachers
// @desc    Get all teachers (simple list)
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find({ isApproved: true, isSuspended: false })
      .populate('userId', 'name email phone avatar')
      .sort('-rating');

    res.json({ success: true, count: teachers.length, teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
