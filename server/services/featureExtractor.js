const crypto = require('crypto');

// Known high-risk / spam top-level domains frequently abused in phishing campaigns
const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'buzz', 'work', 'click', 'tk', 'ml', 'ga', 'cf', 'gq',
  'monster', 'club', 'surf', 'cam', 'loan', 'rest', 'stream', 'gdn',
  'fit', 'kim', 'win', 'racing', 'country', 'party', 'science'
]);

// High-confidence legitimate domains list to prevent false positives on major portals
const TRUSTED_DOMAINS = new Set([
  'google.com', 'www.google.com', 'accounts.google.com',
  'github.com', 'www.github.com',
  'microsoft.com', 'www.microsoft.com', 'login.microsoftonline.com',
  'apple.com', 'www.apple.com',
  'amazon.com', 'www.amazon.com',
  'paypal.com', 'www.paypal.com',
  'linkedin.com', 'www.linkedin.com',
  'twitter.com', 'x.com',
  'facebook.com', 'www.facebook.com',
  'wikipedia.org', 'en.wikipedia.org',
  'youtube.com', 'www.youtube.com',
  'netflix.com', 'www.netflix.com',
  'stackoverflow.com', 'developer.mozilla.org',
  'cloudflare.com', 'vercel.com', 'render.com', 'github.io'
]);

// Common URL shorteners frequently leveraged to mask phishing destinations
const SHORTENER_DOMAINS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
  'adf.ly', 'bit.do', 'cutt.ly', 'rb.gy', 'shorte.st'
]);

// Sensitive credential / financial keywords
const SENSITIVE_KEYWORDS = [
  'login', 'verify', 'account', 'secure', 'banking', 'update', 'signin',
  'wallet', 'paypal', 'apple', 'netflix', 'microsoft', 'confirm', 'security',
  'service', 'free', 'bonus', 'claim', 'recovery', 'password', 'credential',
  'suspend', 'restricted', 'validation', 'authenticate', 'billing', 'invoice'
];

/**
 * Calculates the Shannon Entropy of a string.
 * Measures randomness; algorithmically generated or obfuscated URLs have higher entropy.
 */
function calculateShannonEntropy(str) {
  if (!str || str.length === 0) return 0;
  const len = str.length;
  const frequencies = {};
  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return parseFloat(entropy.toFixed(4));
}

/**
 * Checks if the hostname is an IPv4 or IPv6 address.
 */
function isIpAddress(hostname) {
  // IPv4 regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // Simple check for bracketed or raw hex IPv6
  const isIpv6 = hostname.includes(':') || /^\[[0-9a-fA-F:]+\]$/.test(hostname);
  return ipv4Regex.test(hostname) || isIpv6;
}

/**
 * Extracts 22 comprehensive lexical and security features from a URL.
 */
function extractFeatures(rawUrl) {
  let targetUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'http://' + targetUrl;
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch (e) {
    // Fallback if URL constructor fails on strange strings
    parsed = {
      hostname: targetUrl.split('/')[0].split('?')[0],
      pathname: '',
      search: '',
      protocol: 'http:'
    };
  }

  const hostname = (parsed.hostname || '').toLowerCase();
  const pathname = parsed.pathname || '';
  const search = parsed.search || '';
  const protocol = parsed.protocol || 'http:';
  const fullUrl = targetUrl;

  const urlLength = fullUrl.length;
  const domainLength = hostname.length;
  const pathLength = pathname.length;
  const queryLength = search.length;

  const countDots = (fullUrl.match(/\./g) || []).length;
  const countHyphens = (fullUrl.match(/-/g) || []).length;
  const countAt = (fullUrl.match(/@/g) || []).length;
  const countQuestion = (fullUrl.match(/\?/g) || []).length;
  const countEqual = (fullUrl.match(/=/g) || []).length;
  const countPercent = (fullUrl.match(/%/g) || []).length;
  const countSlash = (pathname.match(/\//g) || []).length;

  const digits = (fullUrl.match(/\d/g) || []).length;
  const digitsRatio = urlLength > 0 ? parseFloat((digits / urlLength).toFixed(4)) : 0;

  const hasIp = isIpAddress(hostname) ? 1 : 0;
  const isHttps = protocol === 'https:' ? 1 : 0;

  // Subdomains calculation
  const hostParts = hostname.split('.');
  const subdomainsCount = hostParts.length > 2 ? hostParts.length - 2 : 0;

  // Check prefix-suffix (hyphen inside hostname)
  const hasPrefixSuffix = hostname.includes('-') ? 1 : 0;

  // Double slash redirect in path
  const hasDoubleSlash = pathname.includes('//') ? 1 : 0;

  // TLD extraction
  const tld = hostParts.length > 1 ? hostParts[hostParts.length - 1] : '';
  const suspiciousTld = SUSPICIOUS_TLDS.has(tld) ? 1 : 0;

  // URL Shortener detection
  const isShortened = SHORTENER_DOMAINS.has(hostname) ? 1 : 0;

  // Sensitive keywords count
  let sensitiveKeywordsCount = 0;
  const matchedKeywords = [];
  const lowerUrl = fullUrl.toLowerCase();
  for (const kw of SENSITIVE_KEYWORDS) {
    if (lowerUrl.includes(kw)) {
      sensitiveKeywordsCount++;
      matchedKeywords.push(kw);
    }
  }

  // Shannon entropy
  const entropy = calculateShannonEntropy(fullUrl);

  // Hex / abnormal port
  const hasAbnormalPort = parsed.port && !['80', '443'].includes(parsed.port) ? 1 : 0;

  // Trusted domain check
  const isTrusted = TRUSTED_DOMAINS.has(hostname) || TRUSTED_DOMAINS.has(hostname.replace(/^www\./, ''));

  // Calculate SHA-256 hash of URL for cryptographic report verification
  const sha256 = crypto.createHash('sha256').update(fullUrl).digest('hex');

  const features = {
    url_length: urlLength,
    domain_length: domainLength,
    path_length: pathLength,
    query_length: queryLength,
    count_dots: countDots,
    count_hyphens: countHyphens,
    count_at: countAt,
    count_question: countQuestion,
    count_equal: countEqual,
    count_percent: countPercent,
    count_slash: countSlash,
    count_digits: digits,
    digits_ratio: digitsRatio,
    has_ip: hasIp,
    is_https: isHttps,
    subdomains_count: subdomainsCount,
    has_prefix_suffix: hasPrefixSuffix,
    has_double_slash: hasDoubleSlash,
    suspicious_tld: suspiciousTld,
    is_shortened: isShortened,
    sensitive_keywords_count: sensitiveKeywordsCount,
    shannon_entropy: entropy,
    has_abnormal_port: hasAbnormalPort,
    is_trusted: isTrusted ? 1 : 0
  };

  // Ordered array of numerical features matching the ML training vector
  const featureVector = [
    features.url_length,
    features.domain_length,
    features.path_length,
    features.query_length,
    features.count_dots,
    features.count_hyphens,
    features.count_at,
    features.count_question,
    features.count_equal,
    features.count_percent,
    features.count_slash,
    features.count_digits,
    features.digits_ratio,
    features.has_ip,
    features.is_https,
    features.subdomains_count,
    features.has_prefix_suffix,
    features.has_double_slash,
    features.suspicious_tld,
    features.is_shortened,
    features.sensitive_keywords_count,
    features.shannon_entropy
  ];

  return {
    rawUrl,
    normalizedUrl: targetUrl,
    domain: hostname,
    protocol,
    tld,
    features,
    featureVector,
    matchedKeywords,
    isTrusted,
    sha256
  };
}

module.exports = {
  extractFeatures,
  SUSPICIOUS_TLDS,
  TRUSTED_DOMAINS,
  SHORTENER_DOMAINS,
  SENSITIVE_KEYWORDS
};
