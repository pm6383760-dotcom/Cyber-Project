# PhishGuard AI - Final Year Project Report Abstract & Synopsis

**Project Title:** PhishGuard AI: AI-Powered Phishing URL Detection & Cyber Threat Analysis System  
**Discipline:** Bachelor of Technology (B.Tech) - Computer Science & Engineering  
**Developer:** Prateek Mishra (pm6383760-dotcom)  
**Academic Year:** 2026  

---

## 📄 Abstract

Phishing remains one of the primary attack vectors in modern social engineering and credential harvesting cyberattacks. Traditional defense mechanisms rely predominantly on static blacklists and signature databases, which suffer from substantial latency and fail to protect organizations against zero-hour, algorithmically generated, or freshly registered phishing URLs.

This project introduces **PhishGuard AI**, a full-stack, distributed cybersecurity intelligence web application capable of detecting phishing URLs in real time prior to connection establishment. PhishGuard AI extracts a multidimensional feature vector comprising 22 lexical, structural, and statistical attributes—including Shannon Entropy, raw IP hostname detection, high-abuse Top-Level Domains (TLDs), credential-harvesting tokens, and prefix-suffix brand spoofing.

These features are classified using a trained **Random Forest Ensemble** microservice built with Python and FastAPI, achieving an empirical classification accuracy of **97.45%**, precision of **96.82%**, and recall of **97.91%** on benchmark phishing corpora. An Express.js and Node.js REST API layer orchestrates analysis requests, implements JSON Web Token (JWT) role-based security, securely hashes user passwords via bcrypt, and persists audit logs to MongoDB. 

Crucially, PhishGuard AI addresses the "black box" limitation of machine learning in cybersecurity by providing **Explainable AI (XAI)** metrics: translating mathematical feature contributions into actionable human-interpretable advisories and generating cryptographically fingerprinted (SHA-256) security audit reports in downloadable PDF format.

---

## 🎯 Objectives
1. Design and develop a high-throughput URL feature extraction engine capable of isolating 22 distinct lexical, statistical, and domain indicators.
2. Train, validate, and serialize an ensemble Random Forest machine learning model achieving $>95\%$ precision and recall on phishing benchmarks.
3. Expose the machine learning pipeline as an asynchronous REST microservice using Python 3 and FastAPI.
4. Architect a secure, full-stack orchestration platform using the MERN (MongoDB, Express.js, React.js, Node.js) stack with JWT authentication and bcrypt cryptography.
5. Provide explainable threat insights (XAI) accompanied by downloadable incident reports and interactive analytics charts.

---

## 🏗️ System Architecture Flowchart

```
[ User Input URL ]
        │
        ▼
[ React Vite Cyber SaaS UI ]
        │ (Axios HTTP Request + JWT Bearer)
        ▼
[ Express.js REST API Orchestrator (Port 5000) ]
        │
        ├──► [ Feature Extraction Engine ] (22 Lexical & Statistical Vectors)
        │
        ├──► [ Python FastAPI ML Microservice (Port 8000) ]
        │          │
        │          ▼
        │    [ Scikit-Learn Random Forest Classifier ]
        │    [ (100 Decision Trees, Gini Impurity)   ]
        │
        ├──► [ In-Memory / MongoDB Atlas Layer ] (Persists Scans & Audit Logs)
        │
        ▼
[ Real-Time Explainable Threat Report Response ]
  • Threat Verdict (Phishing / Legitimate)
  • Risk Score (0 - 100)
  • Confidence Percentage
  • Detected Indicators & Penalties
  • Explainability Reasons (XAI)
  • Actionable User Recommendations
  • Cryptographic SHA-256 Fingerprint
  • Downloadable PDF Threat Dossier
```
