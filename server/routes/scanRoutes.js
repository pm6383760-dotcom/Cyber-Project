const express = require('express');
const router = express.Router();
const {
  analyzeUrl,
  getScanHistory,
  getScanById,
  deleteScan,
  clearAllScans,
  getAnalytics,
  exportHistoryCsv
} = require('../controllers/scanController');
const { optionalAuth, protect } = require('../middleware/auth');
const { validateScanInput } = require('../middleware/validate');

router.post('/analyze', optionalAuth, validateScanInput, analyzeUrl);
router.get('/history', optionalAuth, getScanHistory);
router.get('/analytics', getAnalytics);
router.get('/export/csv', exportHistoryCsv);
router.delete('/', optionalAuth, clearAllScans);
router.get('/:id', getScanById);
router.delete('/:id', optionalAuth, deleteScan);

module.exports = router;
