const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const catchAsync = require('../utils/catchAsync');

// @desc    Create new event
// @route   POST /api/v1/events
// @access  Public (for now, until auth is added)
exports.createEvent = catchAsync(async (req, res, next) => {
  const event = await Event.create(req.body);
  
  // Emit real-time notification
  const io = req.app.get('socketio');
  if (io) {
    io.emit('new_event', {
      title: event.title,
      district: event.district,
      _id: event._id
    });
  }

  res.status(201).json({
    success: true,
    data: event,
  });
});

// @desc    Get all approved events
// @route   GET /api/v1/events
// @access  Public
exports.getApprovedEvents = catchAsync(async (req, res, next) => {
  const events = await Event.find({ status: 'approved' }).sort('-date');
  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

// @desc    Filter events by district and/or date
// @route   GET /api/v1/events/filter
// @access  Public
exports.filterEvents = catchAsync(async (req, res, next) => {
  const { district, date, search } = req.query;
  let query = { status: 'approved' };

  if (district) {
    query.district = district;
  }

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    query.date = { $gte: start, $lt: end };
  }

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  // Default sort: Latest first (-date)
  const events = await Event.find(query).sort('-date');

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

// @desc    Approve or reject event (Admin)
// @route   PUT /api/v1/events/:id
// @access  Private/Admin
exports.updateEventStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return next(new ErrorResponse('Invalid status. Please use approved, rejected, or pending.', 400));
  }

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!event) {
    return next(new ErrorResponse('Event not found', 404));
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc    Delete event (Admin)
// @route   DELETE /api/v1/events/:id
// @access  Private/Admin
exports.deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new ErrorResponse('Event not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
  });
});
