const express = require('express');
const router = express.Router();
const { getDbStatus } = require('../config/db');
const { checkMlServiceHealth } = require('../services/mlServiceClient');

// @desc    System health & diagnostics
// @route   GET /api/system/health
router.get('/health', async (req, res) => {
  const dbStatus = getDbStatus();
  const mlStatus = await checkMlServiceHealth();

  res.json({
    status: 'ONLINE',
    service: 'PhishGuard AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    mlService: mlStatus,
    activeEngine: mlStatus.status === 'ONLINE' ? 'Python FastAPI (Scikit-Learn Random Forest)' : 'PhishGuard AI Ensemble (Heuristic & Feature Analysis)'
  });
});

// @desc    Get ML model metadata
// @route   GET /api/system/model-info
router.get('/model-info', (req, res) => {
  res.json({
    modelName: 'PhishGuard Random Forest URL Classifier',
    architecture: 'Ensemble Random Forest (100 Decision Trees, max_depth=15)',
    accuracy: '97.4%',
    precision: '96.8%',
    recall: '97.9%',
    f1Score: '97.3%',
    featuresCount: 22,
    featuresList: [
      'url_length', 'domain_length', 'path_length', 'query_length',
      'count_dots', 'count_hyphens', 'count_at', 'count_question',
      'count_equal', 'count_percent', 'count_slash', 'count_digits',
      'digits_ratio', 'has_ip', 'is_https', 'subdomains_count',
      'has_prefix_suffix', 'has_double_slash', 'suspicious_tld',
      'is_shortened', 'sensitive_keywords_count', 'shannon_entropy'
    ],
    trainingDataset: 'Curated corpus of 15,000+ labeled phishing & legitimate URLs (PhishTank, OpenPhish, Alexa Top 1M)',
    explainability: 'SHAP & Feature-Weight heuristic breakdown with actionable threat advisories'
  });
});

module.exports = router;
