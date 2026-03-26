const Place = require('../models/Place');
const ErrorResponse = require('../utils/errorResponse');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all places
// @route   GET /api/v1/places
// @access  Public
exports.getPlaces = catchAsync(async (req, res, next) => {
  const { district } = req.query;
  let query = {};

  if (district) {
    query.district = district;
  }

  const places = await Place.find(query).sort('name');

  res.status(200).json({
    success: true,
    count: places.length,
    data: places,
  });
});

// @desc    Create a place (Admin/Setup)
// @route   POST /api/v1/places
// @access  Public (for easier setup, normally protected)
exports.createPlace = catchAsync(async (req, res, next) => {
  const place = await Place.create(req.body);
  res.status(201).json({
    success: true,
    data: place,
  });
});
// @desc    Delete a place (Admin)
// @route   DELETE /api/v1/places/:id
// @access  Private/Admin
exports.deletePlace = catchAsync(async (req, res, next) => {
  const place = await Place.findByIdAndDelete(req.params.id);

  if (!place) {
    return next(new ErrorResponse('Place not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Place deleted successfully',
  });
});
