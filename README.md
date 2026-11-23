# CyberShield AI - Threat Detection & Intelligence

CyberShield AI is a modern, responsive, browser-based cybersecurity demonstration platform designed to analyze email text, website URLs, and file metadata for common suspicious indicators. It assigns heuristic risk scores and provides educational insights to help users identify potential cyber threats.

---

## 🚀 Features

- **Security Dashboard**: Real-time overview of recorded scans, threat distributions, average risk scores, and activity trends.
- **Email Phishing Scanner**: Analyzes email content, sender addresses, and subjects for phishing indicators (urgent language, credential harvesting, financial demands, etc.).
- **URL Risk Analyzer**: Evaluates web links for suspicious top-level domains, IP-based URLs, excessive subdomains, and credential tokens.
- **File Inspector**: Checks file metadata, extension risk classifications, and computes client-side SHA-256 cryptographic hashes via Web Crypto API.
- **Scan History & Analytics**: Locally persisted scan records (using `localStorage`) with search, filter, and analytics charts powered by Chart.js.
- **PDF Report Export**: Allows users to download detailed scan reports.

---

## 🛠️ Technology Stack

- **HTML5** & **Semantic Markup**
- **Modern CSS3** (Custom properties, responsive flexbox & grid layouts, dark mode aesthetic)
- **Vanilla JavaScript (ES6+)**
- **Chart.js** (Data visualization)
- **jsPDF** (Client-side report generation)
- **Font Awesome 6** (Icons)
- **Web Crypto API** (Client-side SHA-256 calculation)

---

## 💻 Getting Started

No build tools or server installation required!

1. Clone or download this repository:
   ```bash
   git clone https://github.com/pm6383760-dotcom/Cyber-Project.git
   ```
2. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).

---

## ⚠️ Disclaimer

CyberShield AI is an academic demonstration and awareness tool utilizing heuristic rules. It does not replace enterprise antivirus, automated malware sandbox analysis, or commercial threat intelligence feeds.
