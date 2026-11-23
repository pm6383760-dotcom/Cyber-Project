const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true
  },
  domain: {
    type: String,
    default: ''
  },
  protocol: {
    type: String,
    default: 'https:'
  },
  prediction: {
    type: String,
    enum: ['PHISHING', 'LEGITIMATE', 'SUSPICIOUS'],
    required: true
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  engineUsed: {
    type: String,
    default: 'PhishGuard AI Ensemble'
  },
  indicators: [
    {
      name: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      description: String,
      weight: Number
    }
  ],
  reasons: [String],
  recommendations: [String],
  features: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  sha256: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast query by user and date
scanSchema.index({ user: 1, createdAt: -1 });
scanSchema.index({ url: 1 });

module.exports = mongoose.model('Scan', scanSchema);
