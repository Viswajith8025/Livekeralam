const express = require('express');
const router = express.Router();
const { getMessages, saveMessage, getAllMessages } = require('../controllers/messageController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/').get(authorize('admin'), getAllMessages);
router.route('/:eventId').get(getMessages);
router.route('/').post(saveMessage);

module.exports = router;
