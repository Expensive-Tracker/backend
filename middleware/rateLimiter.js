const rateLimit = require("express-rate-limit");

const userIdRateLimiter = rateLimit({
  windowMs: 3 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  keyGenerator: (req, res) => {
    return req.user?._id?.toString() || req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = userIdRateLimiter;
