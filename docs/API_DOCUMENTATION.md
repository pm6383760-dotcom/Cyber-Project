# PhishGuard AI - REST API Specification

The PhishGuard API is exposed on `http://localhost:5000/api`.

---

## 🔐 1. Authentication Endpoints

### Register User
- **Method:** `POST`
- **Route:** `/api/auth/register`
- **Body:**
```json
{
  "name": "Prateek Mishra",
  "email": "analyst@phishguard.ai",
  "password": "SecurePassword123!"
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registration successful.",
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```

### Login User
- **Method:** `POST`
- **Route:** `/api/auth/login`
- **Body:**
```json
{
  "email": "analyst@phishguard.ai",
  "password": "SecurePassword123!"
}
```

### Demo Credentials (Viva Shortcut)
- **Method:** `GET`
- **Route:** `/api/auth/demo-credentials`

---

## 🔍 2. URL Threat Scanning Endpoints

### Analyze Suspect URL
- **Method:** `POST`
- **Route:** `/api/scans/analyze`
- **Headers:** `Authorization: Bearer <token>` (Optional)
- **Body:**
```json
{
  "url": "http://secure-paypal-login-verify.com.xyz/account"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "scan": {
    "id": "scan_1716500000",
    "url": "http://secure-paypal-login-verify.com.xyz/account",
    "domain": "secure-paypal-login-verify.com.xyz",
    "prediction": "PHISHING",
    "riskScore": 89,
    "riskLevel": "HIGH",
    "confidence": 97.4,
    "engineUsed": "Python FastAPI (Scikit-Learn Random Forest Classifier)",
    "indicators": [
      {
        "name": "High-Risk TLD (.xyz)",
        "severity": "high",
        "description": "Domain uses .xyz known for cyber abuse",
        "weight": 20
      }
    ],
    "reasons": [
      "Simulates brand identity (PayPal) under a high-risk .xyz domain."
    ],
    "recommendations": [
      "Do not enter passwords or sensitive personal details."
    ],
    "features": { ... },
    "sha256": "9a72e81fa2441c0b3128186177b94adcf431e2172776c1dc11177894a4697f37"
  },
  "disclaimer": "Predictions are probabilistic and do not guarantee safety."
}
```

### Get Scan Audit History
- **Method:** `GET`
- **Route:** `/api/scans/history?search=paypal&riskLevel=HIGH&limit=50`

### Get Threat Analytics
- **Method:** `GET`
- **Route:** `/api/scans/analytics`

### Export CSV
- **Method:** `GET`
- **Route:** `/api/scans/export/csv`

---

## ⚙️ 3. System Diagnostics Endpoints

### Health & Engine Diagnostics
- **Method:** `GET`
- **Route:** `/api/system/health`

### Machine Learning Model Info
- **Method:** `GET`
- **Route:** `/api/system/model-info`
