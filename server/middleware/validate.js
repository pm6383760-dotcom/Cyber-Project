// Validation helper middleware
const validateScanInput = (req, res, next) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid URL string to analyze.'
    });
  }

  // Prevent excessively massive inputs
  if (url.length > 2048) {
    return res.status(400).json({
      success: false,
      message: 'URL length exceeds standard maximum allowable limit (2048 characters).'
    });
  }

  next();
};

module.exports = {
  validateScanInput
};
