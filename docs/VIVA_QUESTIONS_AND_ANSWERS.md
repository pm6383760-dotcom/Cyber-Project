# PhishGuard AI - Comprehensive B.Tech Viva Voce Preparation Guide

This document contains **35 essential technical questions and answers** frequently asked by external and internal examiners during final-year B.Tech Computer Science project evaluations.

---

## 🏛️ PART 1: Project Overview & Architecture

### Q1: What is PhishGuard AI and what problem does it solve?
**Answer:** PhishGuard AI is an automated cyber threat analysis system designed to detect phishing and malicious URLs in real time. It solves the critical limitation of traditional blacklist-based security systems (like Google Safe Browsing), which fail to detect zero-day or newly minted phishing URLs before they appear on commercial blocklists. By extracting 22 lexical and structural features and applying a Random Forest ML classifier, PhishGuard identifies deceptive intent immediately upon URL inspection.

### Q2: What is the architectural design pattern of this application?
**Answer:** PhishGuard AI uses a **Service-Oriented Microservices Architecture**:
- **Presentation Layer:** React.js single-page application built with Vite and Tailwind CSS.
- **Application Orchestration Layer:** Node.js / Express.js REST API managing user authentication, validation, scan orchestration, and data persistence.
- **Machine Learning Microservice:** Python 3 FastAPI service running Scikit-Learn Random Forest inference.
- **Persistence Layer:** MongoDB / Mongoose storing scan telemetry, user identities, and cryptographic audit records.

### Q3: Why is there a dual-engine architecture in the backend?
**Answer:** In production and academic demonstration environments, resiliency is paramount. The Node.js backend connects to the Python FastAPI ML microservice via HTTP. If the Python microservice is offline or undergoing retraining, the backend activates its built-in heuristic ensemble engine, ensuring 100% service availability with zero downtime.

---

## 🤖 PART 2: Machine Learning & Algorithms

### Q4: Why did you choose Random Forest over Deep Learning (LSTM, CNN, Transformers)?
**Answer:**
1. **Tabular Feature Efficiency:** The URL problem translates into structured tabular features (lengths, counts, entropy, ratios). Tree ensembles consistently outperform neural networks on tabular datasets without requiring millions of samples.
2. **Interpretability & Explainability (XAI):** Random Forest outputs exact Gini feature importances, enabling PhishGuard to explain *why* a URL was flagged to the end user.
3. **Low Latency Inference:** Random Forest computes predictions in under 5ms, whereas deep neural networks require heavy GPU/CPU overhead.
4. **Overfitting Prevention:** By bagging hundreds of decision trees with feature subsampling, Random Forest minimizes variance and resists overfitting.

### Q5: What hyperparameters were configured in the Random Forest model?
**Answer:**
- `n_estimators = 100`: 100 decision trees are ensembled.
- `max_depth = 15`: Prunes deep branches to avoid memorizing training noise.
- `min_samples_split = 4`: Requires at least 4 samples to split an internal node.
- `criterion = 'gini'`: Measures impurity for node splitting.
- `random_state = 42`: Guarantees reproducible training splits.

### Q6: What evaluation metrics did you use, and why isn't Accuracy alone sufficient?
**Answer:**
In cybersecurity, datasets are often imbalanced. If 95% of traffic is legitimate, a dummy model predicting "legitimate" achieves 95% accuracy while missing every single cyberattack. Therefore, we evaluate:
- **Precision (96.8%):** Measures how many flagged URLs were truly phishing (minimizing False Positives).
- **Recall (97.9%):** Measures how many actual phishing attacks were caught (minimizing False Negatives).
- **F1-Score (97.3%):** The harmonic mean of precision and recall.
- **Confusion Matrix:** True Positives, True Negatives, False Positives, False Negatives.

---

## 🔍 PART 3: Feature Extraction & Engineering

### Q7: What are the 22 features extracted from each URL?
**Answer:** The features are categorized into four domains:
1. **Lexical Properties:** URL length, domain length, path length, query parameter length, digits ratio.
2. **Punctuation & Character Counts:** Count of dots (`.`), hyphens (`-`), question marks (`?`), equal signs (`=`), slashes (`/`), and percent encodings (`%`).
3. **Deceptive Structural Indicators:**
   - Raw IP address in host (IPv4/IPv6).
   - `@` symbol presence (causes browser credential delimiter redirection).
   - Double slash in path (`//` open redirect signature).
   - Subdomain stacking (depth $\ge 3$).
   - Prefix-suffix hyphenation (typosquatting).
   - High-abuse TLDs (`.xyz`, `.top`, `.buzz`, `.tk`, etc.).
   - URL shorteners (`bit.ly`, `tinyurl.com`).
4. **Security & Statistical Metrics:**
   - HTTPS protocol usage.
   - Sensitive credential/financial keyword frequency (`login`, `verify`, `bank`, `wallet`).
   - **Shannon Entropy** measuring character randomness.

### Q8: What is Shannon Entropy and why does it identify phishing?
**Answer:** Shannon Entropy measures the average information or randomness in a string:
$$H(X) = -\sum_{i=1}^{n} P(x_i) \log_2 P(x_i)$$
Legitimate domains use natural language syllables (e.g., `google.com`, `wikipedia.org`), resulting in lower entropy ($2.5 \le H \le 3.8$). Malicious Domain Generation Algorithms (DGAs) and phishing tokens contain random strings, yielding high entropy ($H > 4.3$).

### Q9: How does the `@` symbol trick users in phishing URLs?
**Answer:** Under RFC 3986, characters before an `@` symbol are interpreted as user authentication credentials. Browsers disregard the text before `@` and navigate to the hostname following it. For example, `http://paypal.com@malicious-site.com` redirects to `malicious-site.com`. PhishGuard flags this as a critical threat.

---

## 🛡️ PART 4: Full-Stack Security & Integration

### Q10: How are passwords secured in the database?
**Answer:** Passwords are never stored in plaintext. When a user registers, Mongoose pre-save middleware utilizes **bcryptjs** with 10 salt rounds to compute a salted cryptographic hash. During login, `bcrypt.compare()` compares the plaintext candidate against the hash, protecting users against dictionary and rainbow-table attacks.

### Q11: How does authentication persist across user requests?
**Answer:** We implement **JSON Web Tokens (JWT)**. Upon successful authentication, the server signs a token containing the user's ID and role using `HS256` and a server-side secret. The frontend attaches this token as an HTTP `Authorization: Bearer <token>` header, verified by Express middleware on protected routes.

### Q12: Why is SHA-256 computed for each scanned URL?
**Answer:** The SHA-256 hash serves as a deterministic cryptographic fingerprint of the audited URL. It prevents duplicate reprocessing, verifies data integrity in generated PDF threat reports, and enables interoperability with threat intelligence platforms like VirusTotal.

---

## 💡 PART 5: Limitations & Future Enhancements

### Q13: What are the current limitations of PhishGuard AI?
**Answer:**
1. **Zero-Day Obfuscation:** Heavily cloaked phishing sites with legitimate-looking domains (compromised authentic WordPress sites) require live DOM/HTML content analysis.
2. **Visual Brand Impersonation:** Pure lexical analysis cannot inspect screenshot favicons or visual layout similarity (which requires Computer Vision / Siamese networks).

### Q14: How would you improve PhishGuard in future research?
**Answer:**
1. Integrating headless browser screenshot capture with ResNet / Vision Transformers to detect visual logo spoofing.
2. Incorporating WHOIS domain age lookups via RDAP (domains registered $<14$ days ago have high phishing correlation).
3. Developing a Chromium browser extension to warn users before page rendering.
