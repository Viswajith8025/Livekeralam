const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const catchAsync = require('../utils/catchAsync');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder', // User will need to add real keys
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// @desc    Create Razorpay Order
// @route   POST /api/v1/payments/order
// @access  Private
exports.createOrder = catchAsync(async (req, res, next) => {
  const { eventId } = req.body;
  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorResponse('Event not found', 404));
  }

  // Assuming a static price for now (Day 1 of Phase 3)
  // In a real app, this comes from the event model
  const amount = (event.price || 499) * 100; // Amount in paise

  const options = {
    amount,
    currency: 'INR',
    receipt: `receipt_${Math.random().toString(36).substring(7)}`,
  };

  const order = await razorpay.orders.create(options);

  // Create pending booking
  await Booking.create({
    event: eventId,
    user: req.user.id,
    razorpayOrderId: order.id,
    amount,
    status: 'pending',
  });

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Verify Payment
// @route   POST /api/v1/payments/verify
// @access  Private
exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder');
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest('hex');

  if (digest !== razorpay_signature) {
    return next(new ErrorResponse('Payment verification failed', 400));
  }

  // Update booking status
  await Booking.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    { status: 'paid', razorpayPaymentId: razorpay_payment_id }
  );

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
  });
});
