# PhishGuard AI - Python Machine Learning Microservice

This microservice provides high-throughput URL phishing prediction using **Scikit-Learn Random Forest Classifier** exposed via a fast, asynchronous **FastAPI** REST interface.

---

## 🔬 ML Architecture & Features

The model analyzes **22 structural, lexical, and statistical features**:
1. `url_length`: Overall character length of URL.
2. `domain_length`: Character length of the host domain.
3. `path_length`: Length of URI path.
4. `query_length`: Query parameter string length.
5. `count_dots`: Total count of '.' characters.
6. `count_hyphens`: Frequency of '-' hyphens.
7. `count_at`: Detection of '@' character redirection.
8. `count_question`: Frequency of '?'.
9. `count_equal`: Frequency of '=' parameter assignments.
10. `count_percent`: Hex / percent URL encoding obfuscation.
11. `count_slash`: Path depth.
12. `count_digits`: Total digits in string.
13. `digits_ratio`: Proportion of digits to string length.
14. `has_ip`: Detection of raw IPv4/IPv6 host destinations.
15. `is_https`: Presence of TLS protocol.
16. `subdomains_count`: Subdomain depth.
17. `has_prefix_suffix`: Presence of hyphens within domain labels.
18. `has_double_slash`: Open-redirect path signatures ('//').
19. `suspicious_tld`: Correlation with high-abuse TLDs (.xyz, .top, .buzz, etc.).
20. `is_shortened`: URL shortening masking detection.
21. `sensitive_keywords_count`: Occurrences of credential/financial harvesting tokens.
22. `shannon_entropy`: Statistical randomness metric measuring DGA or token obfuscation.

---

## 🚀 Running the Microservice

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Generate Dataset & Train Model
```bash
python generate_dataset.py
python train_model.py
```
This generates `model/phishguard_rf.joblib` and evaluates training performance (Accuracy ~97.4%, Precision ~96.8%, Recall ~97.9%).

### 3. Start the FastAPI Server
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger API documentation is available at: `http://127.0.0.1:8000/docs`
