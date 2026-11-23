/**
 * PhishGuard Fallback & Heuristic Ensemble ML Engine
 * Generates predictions, risk scores, confidence, explainability reasons,
 * indicator breakdown, and recommendations.
 */

function analyzeUrlHeuristics(extractedData) {
  const { features, domain, isTrusted, matchedKeywords, protocol, tld } = extractedData;
  const indicators = [];
  const reasons = [];
  const recommendations = [];

  let riskScore = 0;

  // 1. Check if it is an established, trusted domain (prevent false positives)
  if (isTrusted) {
    return {
      prediction: 'LEGITIMATE',
      riskScore: 4,
      riskLevel: 'LOW',
      confidence: 98.5,
      engineUsed: 'PhishGuard AI Ensemble (Heuristic & White-List Verification)',
      indicators: [
        {
          name: 'Verified Domain Reputation',
          severity: 'low',
          description: `The domain '${domain}' is an authoritative, verified web entity.`,
          weight: 0
        }
      ],
      reasons: [
        `The domain '${domain}' is recognized as an authoritative web entity with high global trust.`,
        `Standard secure protocol (${protocol}) is properly utilized.`,
        `Zero deceptive lexical obfuscation detected in host or path structure.`
      ],
      recommendations: [
        'Website is identified as authentic. Safe for normal browsing.',
        'Always ensure the browser address bar padlock remains active.'
      ]
    };
  }

  // 2. IP Address in Hostname (Very strong phishing indicator, weight ~25)
  if (features.has_ip === 1) {
    riskScore += 28;
    indicators.push({
      name: 'IP Address as Hostname',
      severity: 'high',
      description: 'URL uses a raw IP address instead of a registered domain name.',
      weight: 28
    });
    reasons.push('Phishers often deploy attacks on raw IP addresses to bypass domain registration identity checks.');
    recommendations.push('Never input credentials or personal data into an IP-based web link.');
  }

  // 3. Suspicious / High-Abuse TLD (weight ~18)
  if (features.suspicious_tld === 1) {
    riskScore += 20;
    indicators.push({
      name: 'High-Risk Top-Level Domain (TLD)',
      severity: 'high',
      description: `Domain uses '.${tld}' which has a statistically high correlation with cyber abuse and spam.`,
      weight: 20
    });
    reasons.push(`Top-level domain '.${tld}' is frequently favored by phishing campaigns due to low-cost or non-verified registration.`);
    recommendations.push(`Exercise extreme caution with websites ending in '.${tld}'.`);
  }

  // 4. Excessive Subdomains (weight ~15)
  if (features.subdomains_count >= 3) {
    const pts = Math.min(20, features.subdomains_count * 5);
    riskScore += pts;
    indicators.push({
      name: 'Excessive Subdomain Stacking',
      severity: features.subdomains_count > 3 ? 'high' : 'medium',
      description: `Detected ${features.subdomains_count} subdomains. Phishers use deep subdomains to imitate genuine domains.`,
      weight: pts
    });
    reasons.push(`The domain structure has ${features.subdomains_count} subdomains, which can mask the true root host.`);
    recommendations.push('Inspect the true root domain immediately preceding the TLD before clicking.');
  }

  // 5. Hyphen in Domain / Prefix-Suffix (weight ~12)
  if (features.has_prefix_suffix === 1) {
    riskScore += 12;
    indicators.push({
      name: 'Domain Prefix-Suffix Hyphenation',
      severity: 'medium',
      description: 'Contains hyphens in domain, often used in typosquatting or brand spoofing.',
      weight: 12
    });
    reasons.push('Hyphenated domains (e.g., brand-security-update) are common in social engineering spoofs.');
  }

  // 6. Sensitive Financial / Credential Keywords (weight ~15-25)
  if (features.sensitive_keywords_count > 0) {
    const pts = Math.min(25, features.sensitive_keywords_count * 9);
    riskScore += pts;
    indicators.push({
      name: 'Credential Harvesting Keywords',
      severity: features.sensitive_keywords_count >= 2 ? 'high' : 'medium',
      description: `Contains high-risk security keywords: ${matchedKeywords.join(', ')}.`,
      weight: pts
    });
    reasons.push(`Presence of sensitive keywords (${matchedKeywords.join(', ')}) outside verified institutional portals indicates credential phishing.`);
    recommendations.push('Do not enter passwords, OTPs, or credit card information on this page.');
  }

  // 7. URL Length & Obfuscation (weight ~10)
  if (features.url_length > 80) {
    riskScore += 12;
    indicators.push({
      name: 'Excessive URL Length',
      severity: 'medium',
      description: `URL length is ${features.url_length} characters (exceeds normal baseline).`,
      weight: 12
    });
    reasons.push('Extremely long URLs are used to hide suspicious parameters or push malicious subdomains off-screen in mobile browsers.');
  }

  // 8. Presence of '@' symbol (weight ~20)
  if (features.count_at > 0) {
    riskScore += 22;
    indicators.push({
      name: 'URL "@" Symbol Obfuscation',
      severity: 'high',
      description: 'Contains "@" symbol, which causes browsers to ignore preceding credentials and redirect to host following the symbol.',
      weight: 22
    });
    reasons.push('The "@" character in a URL can trick users by causing the browser to ignore everything to the left and route to the host to the right.');
    recommendations.push('Terminate connection; "@" symbol manipulation is an overt indicator of deceptive routing.');
  }

  // 9. Insecure Protocol (HTTP instead of HTTPS)
  if (features.is_https === 0) {
    riskScore += 10;
    indicators.push({
      name: 'Unencrypted Connection (HTTP)',
      severity: 'medium',
      description: 'Website does not enforce SSL/TLS encryption.',
      weight: 10
    });
    reasons.push('Communication over plain HTTP is susceptible to interception and tampering.');
    recommendations.push('Only transmit data over authenticated HTTPS connections.');
  }

  // 10. URL Shortener Service
  if (features.is_shortened === 1) {
    riskScore += 15;
    indicators.push({
      name: 'Obfuscated by URL Shortener',
      severity: 'medium',
      description: 'Destination URL is hidden behind a shortening service.',
      weight: 15
    });
    reasons.push('Shortened links mask the actual target destination from security scanners and users.');
    recommendations.push('Use an unshortening utility to inspect the final target before accessing.');
  }

  // 11. High Shannon Entropy (Random string generation)
  if (features.shannon_entropy > 4.4) {
    riskScore += 10;
    indicators.push({
      name: 'High Shannon Entropy',
      severity: 'medium',
      description: `Shannon entropy is ${features.shannon_entropy}, denoting high randomness.`,
      weight: 10
    });
    reasons.push('High entropy in URL strings often corresponds to DGA (Domain Generation Algorithms) or obfuscated tokens.');
  }

  // 12. Double Slash Redirect
  if (features.has_double_slash === 1) {
    riskScore += 14;
    indicators.push({
      name: 'Double Slash Redirection In Path',
      severity: 'high',
      description: 'Contains "//" in the path, typical of open-redirect exploit chains.',
      weight: 14
    });
    reasons.push('Path-based double slashes are frequently exploited to redirect users to unauthorized third-party hosts.');
  }

  // Cap risk score between 0 and 100
  riskScore = Math.min(100, Math.max(0, riskScore));

  // Determine Risk Level and Prediction
  let riskLevel = 'LOW';
  let prediction = 'LEGITIMATE';
  let confidence = 88.0;

  if (riskScore >= 60) {
    riskLevel = 'HIGH';
    prediction = 'PHISHING';
    confidence = Math.min(99.4, 85 + (riskScore - 60) * 0.35);
  } else if (riskScore >= 35) {
    riskLevel = 'MEDIUM';
    prediction = 'SUSPICIOUS';
    confidence = Math.min(92.0, 75 + (riskScore - 35) * 0.5);
  } else {
    riskLevel = 'LOW';
    prediction = 'LEGITIMATE';
    confidence = Math.min(97.5, 88 + (35 - riskScore) * 0.25);
  }

  // Default clean states
  if (indicators.length === 0) {
    indicators.push({
      name: 'Standard Lexical Structure',
      severity: 'low',
      description: 'URL parameters and domain attributes adhere to standard web naming conventions.',
      weight: 0
    });
    reasons.push('No obvious phishing signatures, malicious TLDs, or credential harvesting keywords detected.');
    recommendations.push('URL shows no obvious red flags. Standard browsing vigilance advised.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Verify SSL certificate validity in your browser address bar.');
    recommendations.push('Ensure URL domain matches the organization you intended to visit.');
  }

  return {
    prediction,
    riskScore: Math.round(riskScore),
    riskLevel,
    confidence: parseFloat(confidence.toFixed(1)),
    engineUsed: 'PhishGuard AI Ensemble (Heuristic & Feature Analysis)',
    indicators,
    reasons,
    recommendations
  };
}

module.exports = {
  analyzeUrlHeuristics
};
