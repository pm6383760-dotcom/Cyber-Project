import math
import re
from urllib.parse import urlparse

# Suspicious Top Level Domains commonly utilized in mass phishing campaigns
SUSPICIOUS_TLDS = {
    'xyz', 'top', 'buzz', 'work', 'click', 'tk', 'ml', 'ga', 'cf', 'gq',
    'monster', 'club', 'surf', 'cam', 'loan', 'rest', 'stream', 'gdn',
    'fit', 'kim', 'win', 'racing', 'country', 'party', 'science'
}

# Authoritative trusted domain entities
TRUSTED_DOMAINS = {
    'google.com', 'www.google.com', 'accounts.google.com',
    'github.com', 'www.github.com',
    'microsoft.com', 'www.microsoft.com',
    'apple.com', 'www.apple.com',
    'amazon.com', 'www.amazon.com',
    'paypal.com', 'www.paypal.com',
    'linkedin.com', 'www.linkedin.com',
    'twitter.com', 'x.com',
    'facebook.com', 'www.facebook.com',
    'wikipedia.org', 'en.wikipedia.org',
    'youtube.com', 'www.youtube.com',
    'netflix.com', 'www.netflix.com',
    'stackoverflow.com', 'cloudflare.com'
}

# Common URL Shortener Services
SHORTENERS = {
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
    'adf.ly', 'bit.do', 'cutt.ly', 'rb.gy'
}

# Credential and security phishing keywords
SENSITIVE_KEYWORDS = [
    'login', 'verify', 'account', 'secure', 'banking', 'update', 'signin',
    'wallet', 'paypal', 'apple', 'netflix', 'microsoft', 'confirm', 'security',
    'service', 'free', 'bonus', 'claim', 'recovery', 'password', 'credential',
    'suspend', 'restricted', 'validation', 'authenticate', 'billing', 'invoice'
]

FEATURE_NAMES = [
    'url_length', 'domain_length', 'path_length', 'query_length',
    'count_dots', 'count_hyphens', 'count_at', 'count_question',
    'count_equal', 'count_percent', 'count_slash', 'count_digits',
    'digits_ratio', 'has_ip', 'is_https', 'subdomains_count',
    'has_prefix_suffix', 'has_double_slash', 'suspicious_tld',
    'is_shortened', 'sensitive_keywords_count', 'shannon_entropy'
]

def calculate_shannon_entropy(text: str) -> float:
    """Calculates the Shannon Entropy (randomness measure) of the URL string."""
    if not text:
        return 0.0
    length = len(text)
    freq = {}
    for ch in text:
        freq[ch] = freq.get(ch, 0) + 1
    entropy = 0.0
    for count in freq.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 4)

def is_ip_address(hostname: str) -> int:
    """Determines if the given hostname is an IPv4 or IPv6 address."""
    ipv4_pattern = r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    if re.match(ipv4_pattern, hostname) or ':' in hostname:
        return 1
    return 0

def extract_features(raw_url: str):
    """
    Extracts 22 lexical, domain, and structural features from a URL for ML inference.
    """
    url = raw_url.strip()
    if not re.match(r'^https?://', url, re.IGNORECASE):
        url = 'http://' + url

    try:
        parsed = urlparse(url)
    except Exception:
        parsed = urlparse('http://invalid-url.com')

    hostname = (parsed.hostname or '').lower()
    pathname = parsed.path or ''
    query = parsed.query or ''
    scheme = parsed.scheme.lower() if parsed.scheme else 'http'

    url_length = len(url)
    domain_length = len(hostname)
    path_length = len(pathname)
    query_length = len(query)

    count_dots = url.count('.')
    count_hyphens = url.count('-')
    count_at = url.count('@')
    count_question = url.count('?')
    count_equal = url.count('=')
    count_percent = url.count('%')
    count_slash = pathname.count('/')

    digits = len(re.findall(r'\d', url))
    digits_ratio = round(digits / url_length, 4) if url_length > 0 else 0.0

    has_ip = is_ip_address(hostname)
    is_https = 1 if scheme == 'https' else 0

    host_parts = hostname.split('.')
    subdomains_count = max(0, len(host_parts) - 2) if len(host_parts) > 2 else 0

    has_prefix_suffix = 1 if '-' in hostname else 0
    has_double_slash = 1 if '//' in pathname else 0

    tld = host_parts[-1] if len(host_parts) > 1 else ''
    suspicious_tld = 1 if tld in SUSPICIOUS_TLDS else 0
    is_shortened = 1 if hostname in SHORTENERS else 0

    lower_url = url.lower()
    matched_keywords = [kw for kw in SENSITIVE_KEYWORDS if kw in lower_url]
    sensitive_keywords_count = len(matched_keywords)

    entropy = calculate_shannon_entropy(url)

    feature_dict = {
        'url_length': url_length,
        'domain_length': domain_length,
        'path_length': path_length,
        'query_length': query_length,
        'count_dots': count_dots,
        'count_hyphens': count_hyphens,
        'count_at': count_at,
        'count_question': count_question,
        'count_equal': count_equal,
        'count_percent': count_percent,
        'count_slash': count_slash,
        'count_digits': digits,
        'digits_ratio': digits_ratio,
        'has_ip': has_ip,
        'is_https': is_https,
        'subdomains_count': subdomains_count,
        'has_prefix_suffix': has_prefix_suffix,
        'has_double_slash': has_double_slash,
        'suspicious_tld': suspicious_tld,
        'is_shortened': is_shortened,
        'sensitive_keywords_count': sensitive_keywords_count,
        'shannon_entropy': entropy
    }

    feature_vector = [feature_dict[name] for name in FEATURE_NAMES]

    return {
        'normalized_url': url,
        'domain': hostname,
        'protocol': scheme + ':',
        'tld': tld,
        'features': feature_dict,
        'feature_vector': feature_vector,
        'matched_keywords': matched_keywords,
        'is_trusted': hostname in TRUSTED_DOMAINS
    }
