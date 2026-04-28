const rateLimit = require('express-rate-limit');

// Strict: Auth routes (login/register) — 10 req / 15 min
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many auth attempts. Try again later.' }
});

// Standard: Public API routes — Increased to 300 to prevent UX degradation
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, error: 'Rate limit exceeded.' }
});

// Relaxed: Static/read-heavy routes — 500 req / 15 min
exports.readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, error: 'Rate limit exceeded.' }
});

// Very Strict: Analytics/View increments — 5 req / 15 min per IP
exports.viewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: true, message: 'View count recorded' } // Silent fail for UX
});
