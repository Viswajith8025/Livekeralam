const express = require('express');
const {
  submitContact,
  getContacts,
  replyToContact,
  deleteContact,
  getMyEnquiries
} = require('../controllers/contactController');

const router = express.Router();

const { protect, authorize, optionalProtect } = require('../middlewares/authMiddleware');
const { apiLimiter } = require('../middlewares/rateLimit');

router.post('/', optionalProtect, apiLimiter, submitContact);
router.get('/me', protect, getMyEnquiries);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getContacts);
router.put('/:id/reply', replyToContact);
router.delete('/:id', deleteContact);

module.exports = router;
