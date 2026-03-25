const ErrorResponse = require('../utils/errorResponse');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const message = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
    next(new ErrorResponse(message, 400));
  }
};

module.exports = validate;
