const express = require('express');
const { getPlaces, createPlace } = require('../controllers/placeController');
const validate = require('../middlewares/validate');
const { createPlaceSchema } = require('../validations/placeValidation');

const router = express.Router();

router.route('/').get(getPlaces).post(validate(createPlaceSchema), createPlace);

module.exports = router;
