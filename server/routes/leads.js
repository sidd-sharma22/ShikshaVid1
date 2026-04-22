const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Teacher = require('../models/Teacher');
const { protect } = require('../middleware/auth');

// @route   POST /api/leads/track
// @desc    Track a lead interaction
router.post('/track', protect, async (req, res) => {
  try {
    const { teacherId, type } = req.body;

    await Lead.create({
      studentId: req.user._id,
      teacherId,
      type
    });

    // Increment counters on teacher
    const updateField = {};
    if (type === 'call') updateField.callClicks = 1;
    else if (type === 'whatsapp') updateField.whatsappClicks = 1;
    else if (type === 'booking') updateField.demoBookings = 1;
    updateField.totalLeads = 1;

    await Teacher.findByIdAndUpdate(teacherId, { $inc: updateField });

    res.json({ success: true, message: 'Lead tracked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
