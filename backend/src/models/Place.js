const mongoose = require('mongoose');
const { KERALA_DISTRICTS } = require('../utils/constants');

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    district: {
      type: String,
      required: [true, 'Please select a district'],
      enum: {
        values: KERALA_DISTRICTS,
        message: 'Please select a valid Kerala district',
      },
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    category: {
      type: String,
      enum: ['Beach', 'Hill Station', 'Backwater', 'Waterfall', 'Heritage', 'Temple', 'Spiritual', 'Nature', 'other'],
      default: 'other',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Place', placeSchema);
