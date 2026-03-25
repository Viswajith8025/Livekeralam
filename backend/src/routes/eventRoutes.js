const express = require('express');
const {
  createEvent,
  getApprovedEvents,
  filterEvents,
  updateEventStatus,
  deleteEvent
} = require('../controllers/eventController');
const validate = require('../middlewares/validate');
const { createEventSchema } = require('../validations/eventValidation');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Order matters: specific routes before generic ones (if any)
router.get('/filter', filterEvents);
router.route('/').get(getApprovedEvents).post(validate(createEventSchema), createEvent);
router.route('/:id')
  .put(protect, authorize('admin'), updateEventStatus)
  .delete(protect, authorize('admin'), deleteEvent);

module.exports = router;
