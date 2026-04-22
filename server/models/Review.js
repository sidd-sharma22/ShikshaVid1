const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxlength: 500
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate reviews
reviewSchema.index({ studentId: 1, teacherId: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(teacherId) {
  const result = await this.aggregate([
    { $match: { teacherId, isApproved: true } },
    {
      $group: {
        _id: '$teacherId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  const Teacher = require('./Teacher');
  if (result.length > 0) {
    await Teacher.findByIdAndUpdate(teacherId, {
      rating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews
    });
  } else {
    await Teacher.findByIdAndUpdate(teacherId, {
      rating: 0,
      totalReviews: 0
    });
  }
};

// Recalculate after save/remove
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.teacherId);
});

reviewSchema.post('findOneAndDelete', function(doc) {
  if (doc) {
    doc.constructor.calculateAverageRating(doc.teacherId);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
