const Scan = require('../models/Scan');
const { extractFeatures } = require('../services/featureExtractor');
const { predictUrl } = require('../services/mlServiceClient');
const { getDbStatus } = require('../config/db');
const { scans } = require('../services/memoryStore');

// Initial sample scans for rich analytics even on fresh install
if (scans.length === 0) {
  scans.push(
    {
      _id: 'scan_sample_01',
      url: 'https://www.google.com',
      domain: 'google.com',
      protocol: 'https:',
      prediction: 'LEGITIMATE',
      riskScore: 2,
      riskLevel: 'LOW',
      confidence: 99.2,
      engineUsed: 'PhishGuard AI Ensemble',
      indicators: [{ name: 'Authoritative Domain', severity: 'low', description: 'Verified top authority domain', weight: 0 }],
      reasons: ['Authentic domain registry with zero malicious entropy.'],
      recommendations: ['Safe for regular browsing.'],
      features: { url_length: 22, has_ip: 0, is_https: 1, subdomains_count: 1, shannon_entropy: 3.52 },
      sha256: 'ed2871ac2611f1ef704c29937a142d67b1d39402da2819f75321b371f2f259e3',
      createdAt: new Date(Date.now() - 3600000 * 5)
    },
    {
      _id: 'scan_sample_02',
      url: 'http://secure-paypal-login-verify.com.xyz/account/update',
      domain: 'secure-paypal-login-verify.com.xyz',
      protocol: 'http:',
      prediction: 'PHISHING',
      riskScore: 89,
      riskLevel: 'HIGH',
      confidence: 97.4,
      engineUsed: 'PhishGuard AI Ensemble (Heuristic & Feature Analysis)',
      indicators: [
        { name: 'High-Risk TLD (.xyz)', severity: 'high', description: 'Uses .xyz domain linked to abuse campaigns', weight: 20 },
        { name: 'Credential Harvesting Terms', severity: 'high', description: 'Contains paypal, login, verify, account, update', weight: 25 },
        { name: 'Unencrypted HTTP', severity: 'medium', description: 'Insecure protocol transmission', weight: 10 }
      ],
      reasons: ['Simulates brand identity (PayPal) under a suspicious .xyz domain.'],
      recommendations: ['Do not input any credentials.', 'Report URL to cybersecurity authorities.'],
      features: { url_length: 56, has_ip: 0, is_https: 0, subdomains_count: 2, suspicious_tld: 1, shannon_entropy: 4.62 },
      sha256: '9a72e81fa2441c0b3128186177b94adcf431e2172776c1dc11177894a4697f37',
      createdAt: new Date(Date.now() - 3600000 * 3)
    },
    {
      _id: 'scan_sample_03',
      url: 'http://192.168.1.105:8080/bank/login.php',
      domain: '192.168.1.105',
      protocol: 'http:',
      prediction: 'PHISHING',
      riskScore: 92,
      riskLevel: 'HIGH',
      confidence: 98.1,
      engineUsed: 'PhishGuard AI Ensemble (Heuristic & Feature Analysis)',
      indicators: [
        { name: 'Raw IP Hostname', severity: 'high', description: 'URL uses raw IP instead of registered domain', weight: 28 },
        { name: 'Abnormal Port (8080)', severity: 'medium', description: 'Non-standard port execution', weight: 10 },
        { name: 'Credential Keyword (login)', severity: 'high', description: 'Targets banking credentials', weight: 18 }
      ],
      reasons: ['Raw IP address targeting banking login forms is a textbook credential stealer pattern.'],
      recommendations: ['Immediately abort connection.'],
      features: { url_length: 39, has_ip: 1, is_https: 0, has_abnormal_port: 1, shannon_entropy: 4.15 },
      sha256: '4b7911b61c9441113b5efc1c382f71932371a3e6a47926c48325e68341147a46',
      createdAt: new Date(Date.now() - 3600000 * 1)
    }
  );
}

// @desc    Analyze a URL for phishing & threat signatures
// @route   POST /api/scans/analyze
// @access  Public / Optional Auth
exports.analyzeUrl = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid URL string is required.'
      });
    }

    // 1. Extract 22 lexical and security features
    const extractedData = extractFeatures(url);

    // 2. Perform ML & Heuristic Prediction
    const predictionResult = await predictUrl(extractedData);

    const scanRecord = {
      user: req.user ? req.user.id : null,
      url: extractedData.normalizedUrl,
      domain: extractedData.domain,
      protocol: extractedData.protocol,
      prediction: predictionResult.prediction,
      riskScore: predictionResult.riskScore,
      riskLevel: predictionResult.riskLevel,
      confidence: predictionResult.confidence,
      engineUsed: predictionResult.engineUsed,
      indicators: predictionResult.indicators,
      reasons: predictionResult.reasons,
      recommendations: predictionResult.recommendations,
      features: extractedData.features,
      sha256: extractedData.sha256,
      createdAt: new Date()
    };

    const dbStatus = getDbStatus();
    let savedScan = null;

    if (dbStatus.connected) {
      savedScan = await Scan.create(scanRecord);
    } else {
      scanRecord._id = 'scan_' + Date.now();
      scans.unshift(scanRecord);
      savedScan = scanRecord;
    }

    return res.status(200).json({
      success: true,
      message: 'URL analysis completed successfully.',
      scan: {
        id: savedScan._id,
        url: savedScan.url,
        domain: savedScan.domain,
        protocol: savedScan.protocol,
        prediction: savedScan.prediction,
        riskScore: savedScan.riskScore,
        riskLevel: savedScan.riskLevel,
        confidence: savedScan.confidence,
        engineUsed: savedScan.engineUsed,
        indicators: savedScan.indicators,
        reasons: savedScan.reasons,
        recommendations: savedScan.recommendations,
        features: savedScan.features,
        sha256: savedScan.sha256,
        createdAt: savedScan.createdAt
      },
      disclaimer: 'DISCLAIMER: PhishGuard AI provides probabilistic cyber threat estimations based on machine learning models and heuristic rules. A Low Risk score does not provide an absolute guarantee that a website is safe. Always maintain security vigilance.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's or recent scan history
// @route   GET /api/scans/history
// @access  Public / Authenticated
exports.getScanHistory = async (req, res, next) => {
  try {
    const { search = '', riskLevel = 'ALL', limit = 50 } = req.query;
    const dbStatus = getDbStatus();

    let scanList = [];

    if (dbStatus.connected) {
      const query = {};
      if (req.user) {
        query.user = req.user.id;
      }
      if (riskLevel && riskLevel !== 'ALL') {
        query.riskLevel = riskLevel.toUpperCase();
      }
      if (search) {
        query.$or = [
          { url: { $regex: search, $options: 'i' } },
          { domain: { $regex: search, $options: 'i' } }
        ];
      }

      scanList = await Scan.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit, 10));
    } else {
      let filtered = [...scans];
      if (riskLevel && riskLevel !== 'ALL') {
        filtered = filtered.filter(s => s.riskLevel === riskLevel.toUpperCase());
      }
      if (search) {
        const sLower = search.toLowerCase();
        filtered = filtered.filter(s => s.url.toLowerCase().includes(sLower) || (s.domain && s.domain.toLowerCase().includes(sLower)));
      }
      scanList = filtered.slice(0, parseInt(limit, 10));
    }

    return res.json({
      success: true,
      count: scanList.length,
      scans: scanList
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single scan details by ID
// @route   GET /api/scans/:id
// @access  Public
exports.getScanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDbStatus();

    let scan = null;
    if (dbStatus.connected) {
      scan = await Scan.findById(id);
    } else {
      scan = scans.find(s => s._id === id || s.id === id);
    }

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan record not found.'
      });
    }

    return res.json({
      success: true,
      scan
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a scan record
// @route   DELETE /api/scans/:id
// @access  Public / Authenticated
exports.deleteScan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDbStatus();

    if (dbStatus.connected) {
      await Scan.findByIdAndDelete(id);
    } else {
      const idx = scans.findIndex(s => s._id === id || s.id === id);
      if (idx !== -1) {
        scans.splice(idx, 1);
      }
    }

    return res.json({
      success: true,
      message: 'Scan record deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear scan history
// @route   DELETE /api/scans
// @access  Public / Authenticated
exports.clearAllScans = async (req, res, next) => {
  try {
    const dbStatus = getDbStatus();
    if (dbStatus.connected) {
      if (req.user) {
        await Scan.deleteMany({ user: req.user.id });
      } else {
        await Scan.deleteMany({});
      }
    } else {
      scans.length = 0;
    }

    return res.json({
      success: true,
      message: 'All scan records cleared successfully.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get aggregate analytics metrics
// @route   GET /api/scans/analytics
// @access  Public
exports.getAnalytics = async (req, res, next) => {
  try {
    const dbStatus = getDbStatus();
    let scanList = [];

    if (dbStatus.connected) {
      scanList = await Scan.find({}).sort({ createdAt: -1 });
    } else {
      scanList = scans;
    }

    const totalScans = scanList.length;
    let phishingCount = 0;
    let legitimateCount = 0;
    let suspiciousCount = 0;
    let highRiskCount = 0;
    let mediumRiskCount = 0;
    let lowRiskCount = 0;
    let totalRiskScore = 0;

    const indicatorFrequency = {};

    scanList.forEach(s => {
      totalRiskScore += s.riskScore || 0;
      if (s.prediction === 'PHISHING') phishingCount++;
      else if (s.prediction === 'LEGITIMATE') legitimateCount++;
      else suspiciousCount++;

      if (s.riskLevel === 'HIGH') highRiskCount++;
      else if (s.riskLevel === 'MEDIUM') mediumRiskCount++;
      else lowRiskCount++;

      if (Array.isArray(s.indicators)) {
        s.indicators.forEach(ind => {
          indicatorFrequency[ind.name] = (indicatorFrequency[ind.name] || 0) + 1;
        });
      }
    });

    const avgRiskScore = totalScans > 0 ? Math.round(totalRiskScore / totalScans) : 0;

    // Format top indicators for charts
    const topIndicators = Object.keys(indicatorFrequency)
      .map(name => ({ name, count: indicatorFrequency[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Distribution arrays for Recharts
    const riskDistribution = [
      { name: 'Low Risk', value: lowRiskCount, color: '#10B981' },
      { name: 'Medium Risk', value: mediumRiskCount, color: '#F59E0B' },
      { name: 'High Risk', value: highRiskCount, color: '#EF4444' }
    ];

    const predictionRatio = [
      { name: 'Legitimate', count: legitimateCount, color: '#10B981' },
      { name: 'Phishing', count: phishingCount, color: '#EF4444' },
      { name: 'Suspicious', count: suspiciousCount, color: '#F59E0B' }
    ];

    return res.json({
      success: true,
      analytics: {
        totalScans,
        phishingCount,
        legitimateCount,
        suspiciousCount,
        avgRiskScore,
        highRiskCount,
        mediumRiskCount,
        lowRiskCount,
        riskDistribution,
        predictionRatio,
        topIndicators
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export scan history to CSV format
// @route   GET /api/scans/export/csv
// @access  Public
exports.exportHistoryCsv = async (req, res, next) => {
  try {
    const dbStatus = getDbStatus();
    let scanList = [];

    if (dbStatus.connected) {
      scanList = await Scan.find({}).sort({ createdAt: -1 });
    } else {
      scanList = scans;
    }

    let csv = 'ID,URL,Domain,Prediction,Risk_Score,Risk_Level,Confidence,Engine,Date\n';
    scanList.forEach(s => {
      const cleanUrl = (s.url || '').replace(/"/g, '""');
      const cleanDomain = (s.domain || '').replace(/"/g, '""');
      csv += `"${s._id || s.id}","${cleanUrl}","${cleanDomain}","${s.prediction}",${s.riskScore},"${s.riskLevel}",${s.confidence}%,"${s.engineUsed}","${new Date(s.createdAt).toISOString()}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`phishguard-scans-export-${Date.now()}.csv`);
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};
