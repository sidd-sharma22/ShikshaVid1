const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendEmail, contactFormEmail } = require('../utils/email');

// @route   POST /api/contact
// @desc    Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const contact = await Contact.create({ name, email, message });

    // Send email notification to admin
    const emailContent = contactFormEmail(name, email, message);
    sendEmail({ 
      to: process.env.EMAIL_USER, 
      ...emailContent 
    }).catch(console.error);

    res.status(201).json({ 
      success: true, 
      message: 'Thank you! We will get back to you soon.' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
