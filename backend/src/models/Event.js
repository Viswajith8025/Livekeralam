const mongoose = require('mongoose');
const { KERALA_DISTRICTS } = require('../utils/constants');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    district: {
      type: String,
      required: [true, 'Please select a district'],
      enum: {
        values: KERALA_DISTRICTS,
        message: 'Please select a valid Kerala district',
      },
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    image: {
      type: String,
      default: 'no-image.jpg',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    latitude: {
      type: Number,
      required: false, // Optional for now
    },
    longitude: {
      type: Number,
      required: false, // Optional for now
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
