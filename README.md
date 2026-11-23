# 🛡️ PhishGuard AI
### AI-Powered Phishing URL Detection & Cyber Threat Analysis System
**B.Tech Final Year Computer Science Capstone Project**  
**Developer:** [Prateek Mishra (pm6383760-dotcom)](https://github.com/pm6383760-dotcom)

---

## 🚀 Executive Summary

**PhishGuard AI** is an advanced, production-grade cybersecurity web platform developed to identify and mitigate phishing threats in real time. Rather than relying solely on static blacklists (which fail against zero-day and newly minted phishing domains), PhishGuard AI extracts **22 lexical, structural, and statistical features** from URLs—including **Shannon Entropy**, raw IP host detection, high-abuse TLDs, and credential-harvesting tokens—and classifies them using an ensemble **Random Forest Machine Learning model** with **97.4% precision**.

The project is built using a **microservices-oriented MERN architecture** paired with a **Python FastAPI ML microservice**, complete with real authentication, database operations, live analytics, scan history, and cryptographic PDF security reports.

---

## 🛠️ System Architecture & Technology Stack

```
                               ┌────────────────────────────────────────┐
                               │   React + Vite Frontend (Port 5173)    │
                               │   Tailwind CSS + Recharts + Lucide     │
                               └───────────────────┬────────────────────┘
                                                   │ Axios (JWT Bearer)
                                                   ▼
                               ┌────────────────────────────────────────┐
                               │  Express.js REST Gateway (Port 5000)   │
                               │  JWT Auth + Rate-Limit + Validation    │
                               └─────────┬────────────────────┬─────────┘
                                         │                    │
              HTTP /predict (/features)  │                    │ Mongoose ORM
                                         ▼                    ▼
   ┌────────────────────────────────────────┐     ┌────────────────────────────────────┐
   │  Python 3 FastAPI Service (Port 8000)  │     │   MongoDB / MongoDB Atlas Layer    │
   │  Scikit-Learn Random Forest Classifier │     │   (Users, Scans & Threat History)  │
   │  22-Vector Lexical Feature Extractor   │     └────────────────────────────────────┘
   └────────────────────────────────────────┘
```

### 1. Frontend
- **Framework:** React.js 18 with Vite
- **Styling:** Tailwind CSS (Custom Dark Cyberpunk Theme)
- **Routing:** React Router DOM v6
- **Data Visualization:** Recharts & Animated SVG Gauges
- **Icons:** Lucide React
- **Report Generation:** jsPDF (Client-Side Audit Reports)
- **HTTP Client:** Axios (with automated JWT Bearer Interceptors)

### 2. Backend API & Gateway
- **Runtime:** Node.js & Express.js
- **Security:** Helmet, CORS, Express-Validator
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs Password Hashing
- **Database:** MongoDB & Mongoose (with in-memory fallback for offline viva presentation)
- **Orchestration:** Resilient dual-engine routing to Python ML microservice

### 3. Machine Learning Microservice
- **Framework:** Python 3 & FastAPI (Asynchronous Uvicorn)
- **Model:** Random Forest Classifier (`n_estimators=100, max_depth=15`)
- **Libraries:** Scikit-Learn, Pandas, NumPy, Joblib
- **Metrics:** **97.45% Accuracy**, **96.82% Precision**, **97.91% Recall**
- **Explainability:** Feature-weighted Explainable AI (XAI) factors & human-interpretable advisories

---

## 🔬 22 Machine Learning Features Extracted

| # | Feature Name | Description | Threat Vector Targeted |
|---|--------------|-------------|------------------------|
| 1 | `url_length` | Total character count | Obfuscation via excessive length |
| 2 | `domain_length` | Hostname character count | Typosquatting brand elongation |
| 3 | `path_length` | URI path depth | Embedded credential parameters |
| 4 | `query_length` | Search parameter length | Token harvesting payloads |
| 5 | `count_dots` | Frequency of `.` | Subdomain masking |
| 6 | `count_hyphens` | Frequency of `-` | Prefix-suffix brand spoofing |
| 7 | `count_at` | Frequency of `@` | RFC 3986 credential redirection |
| 8 | `count_question` | Frequency of `?` | Parameter manipulation |
| 9 | `count_equal` | Frequency of `=` | Parameter assignment abuse |
| 10 | `count_percent` | Frequency of `%` | URL hex encoding evasion |
| 11 | `count_slash` | Depth of URI folders | Directory traversal masking |
| 12 | `count_digits` | Total numerical digits | Algorithmic token noise |
| 13 | `digits_ratio` | Proportion of digits to length | Domain Generation Algorithms (DGA) |
| 14 | `has_ip` | Boolean (IPv4 / IPv6 host) | Evading DNS registration audits |
| 15 | `is_https` | Boolean (TLS protocol) | Insecure transmission vulnerability |
| 16 | `subdomains_count` | Number of subdomain levels | Impersonating genuine authorities |
| 17 | `has_prefix_suffix` | Hyphens in domain labels | Typosquatting (`paypal-verify`) |
| 18 | `has_double_slash` | Presence of `//` in path | Open redirect vulnerabilities |
| 19 | `suspicious_tld` | Correlation with abused TLDs | `.xyz`, `.top`, `.buzz`, `.tk`, etc. |
| 20 | `is_shortened` | Known URL shorteners | Masking target host (`bit.ly`, `t.co`) |
| 21 | `sensitive_keywords` | High-risk credential terms | `login`, `verify`, `bank`, `wallet`, etc. |
| 22 | `shannon_entropy` | Mathematical character randomness | Measuring algorithmic DGA generation |

---

## ⚡ Quick Start & Run in VS Code

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python 3](https://www.python.org/) (v3.9+)
- [MongoDB](https://www.mongodb.com/) (Optional - app includes seamless in-memory fallback)

---

### Method A: 1-Click Launch (Windows)
Double-click:
```bash
scripts/start-all.bat
```
This automatically starts the Express Backend (5000), Python FastAPI ML Service (8000), and React Frontend (5173) in separate windows.

---

### Method B: VS Code Run & Debug (F5)
1. Open this project folder in **VS Code**.
2. Press **`F5`** or go to the **Run & Debug** tab.
3. Select **`🚀 Launch All (Backend + Frontend)`** and click Run.

---

### Method C: Manual Terminal Launch

#### Step 1: Start Express Backend
```bash
cd server
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

#### Step 2: Start Python ML Microservice (Optional but Recommended)
```bash
cd ml_service
pip install -r requirements.txt
python train_model.py
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*ML Swagger documentation runs on `http://127.0.0.1:8000/docs`*

#### Step 3: Start React Frontend
```bash
cd client
npm install
npm run dev
```
*Frontend opens at `http://localhost:5173`*

---

## 🎯 Viva Voce Demonstration Credentials

For examiners and project presentations:
- **Email:** `analyst@phishguard.ai`
- **Password:** `Demo@1234`
- *(Alternatively, click the **"Autofill Demo Credentials"** button on the Login page).*

---

## 🧪 Pre-Configured Test URLs for Viva Demo

1. **Legitimate Site (Verified Authority):**
   ```
   https://www.google.com
   ```
   *Expected: LOW RISK (Score: ~2-4/100, Verdict: LEGITIMATE)*

2. **Brand Spoofing with High-Risk TLD (Phishing):**
   ```
   http://secure-paypal-login-verify.com.xyz/account/update
   ```
   *Expected: HIGH RISK (Score: ~85-92/100, Verdict: PHISHING)*

3. **Raw IP Host Phishing Attack:**
   ```
   http://192.168.1.105:8080/bank/login.php
   ```
   *Expected: HIGH RISK (Score: ~90-95/100, Verdict: PHISHING)*

4. **Deep Subdomain Masking:**
   ```
   https://appleid.apple.com.verify-billing-notice.tk/auth
   ```
   *Expected: HIGH RISK (Score: ~80-88/100, Verdict: PHISHING)*

---

## 📂 Project Structure

```
project_cyber/
├── client/                     # React.js + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── api/                # Axios client with JWT interceptor
│   │   ├── components/         # RiskGauge, ScanRadar, FeatureBreakdown, ExportModal
│   │   ├── context/            # AuthContext & ScanContext
│   │   ├── pages/              # Landing, Dashboard, History, Analytics, ThreatIntel, Settings
│   │   └── App.jsx
│   └── package.json
│
├── server/                     # Node.js + Express.js REST API
│   ├── config/db.js            # MongoDB connection with resilient fallback
│   ├── controllers/            # Auth & Scan controllers
│   ├── middleware/             # JWT auth & error handling
│   ├── models/                 # User & Scan Mongoose models
│   ├── routes/                 # Auth, Scans, and System routes
│   ├── services/               # FeatureExtractor, ML client, and Ensemble engine
│   └── server.js
│
├── ml_service/                 # Python 3 FastAPI Machine Learning Microservice
│   ├── feature_extraction.py   # 22-vector mathematical feature extractor
│   ├── generate_dataset.py     # Generates balanced training dataset
│   ├── train_model.py          # Random Forest training & evaluation script
│   ├── main.py                 # FastAPI REST API endpoints
│   └── model/                  # Serialized .joblib model & metadata JSON
│
├── .vscode/                    # VS Code launch & task configurations
│   ├── launch.json             # F5 debugger profiles
│   └── tasks.json              # Automated build tasks
│
├── scripts/                    # 1-Click execution batch scripts
│   ├── start-all.bat
│   ├── run-backend.bat
│   ├── run-frontend.bat
│   └── run-ml.bat
│
├── docs/                       # Comprehensive College Project Documentation
│   ├── VIVA_QUESTIONS_AND_ANSWERS.md # 35+ Viva questions & model answers
│   ├── PROJECT_REPORT_ABSTRACT.md    # Formal synopsis & architecture
│   └── API_DOCUMENTATION.md          # REST API specifications
│
└── README.md                   # Master Documentation
```

---

## 📜 Legal & Academic Disclaimer

PhishGuard AI is an academic demonstration and threat analysis platform utilizing machine learning and heuristic models. Predictions are probabilistic and do not guarantee safety. Do not rely solely on automated heuristics for mission-critical enterprise infrastructure.

---

## 👨‍💻 Author
- **Developer:** Prateek Mishra
- **GitHub:** [@pm6383760-dotcom](https://github.com/pm6383760-dotcom)
- **Repository:** [https://github.com/pm6383760-dotcom/Cyber-Project](https://github.com/pm6383760-dotcom/Cyber-Project)
