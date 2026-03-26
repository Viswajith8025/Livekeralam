const express = require('express');
const { getPlaces, createPlace, deletePlace } = require('../controllers/placeController');
const validate = require('../middlewares/validate');
const { createPlaceSchema } = require('../validations/placeValidation');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getPlaces)
  .post(protect, authorize('admin'), validate(createPlaceSchema), createPlace);

router.route('/:id')
  .delete(protect, authorize('admin'), deletePlace);

module.exports = router;
