
/* ==========================================
   CyberShield AI
   Browser-only Heuristic Threat Analyzer
========================================== */

const STORAGE_KEY = "cybershield_scans_v1";

let scans = loadScans();
let charts = {};
let lastResult = null;

// ---------- STORAGE ----------
function loadScans() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveScans() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
}

function addScan(scan) {
  scan.id = Date.now().toString() + Math.random().toString(16).slice(2, 7);
  scan.date = new Date().toISOString();
  scans.unshift(scan);
  saveScans();
  updateDashboard();
}

// ---------- NAVIGATION ----------
function showPage(pageName) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageName);
  if (!page) return;

  page.classList.add("active");

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === pageName);
  });

  const labels = {
    dashboard: "Dashboard",
    email: "Email Scanner",
    url: "URL Analyzer",
    file: "File Scanner",
    history: "Scan History",
    analytics: "Analytics",
    about: "About Project"
  };

  document.getElementById("currentPageName").textContent =
    labels[pageName] || pageName;

  document.getElementById("sidebar").classList.remove("open");

  if (pageName === "history") renderHistory();
  if (pageName === "analytics") renderAnalytics();

  if (pageName === "dashboard") {
    setTimeout(() => {
      renderDashboardCharts();
    }, 100);
  }
}

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

// ---------- HELPERS ----------
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[ch]));
}

function showToast(message) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${escapeHTML(message)}`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

function getSeverity(score) {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  if (score >= 15) return "Low";
  return "Safe";
}

function getSeverityClass(severity) {
  return "status-" + severity.toLowerCase();
}

function getSeverityColor(severity) {
  return {
    Critical: "#ff5570",
    High: "#ff5570",
    Medium: "#ffbf55",
    Low: "#4b8bff",
    Safe: "#36d399"
  }[severity] || "#4b8bff";
}

function getIcon(type) {
  return {
    Email: "fa-envelope",
    URL: "fa-link",
    File: "fa-file-shield"
  }[type] || "fa-shield";
}

function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ---------- DETECTION ENGINE ----------
function analyzeIndicators(text, rules) {
  const findings = [];
  let score = 0;

  rules.forEach(rule => {
    if (rule.regex.test(text)) {
      score += rule.weight;
      findings.push(rule.message);
    }
  });

  return {
    score: clampScore(score),
    findings
  };
}

// ---------- EMAIL ANALYZER ----------
const emailRules = [
  {
    regex: /\b(urgent|immediately|act now|limited time|asap|final warning|suspended today)\b/i,
    weight: 15,
    message: "Urgent or pressure-based language detected."
  },
  {
    regex: /\b(password|passcode|otp|verification code|login credentials)\b/i,
    weight: 25,
    message: "Requests involving passwords, OTPs or credentials detected."
  },
  {
    regex: /\b(bank account|credit card|wire transfer|payment|billing|wallet)\b/i,
    weight: 15,
    message: "Financial or payment-related wording detected."
  },
  {
    regex: /\b(click here|verify now|open this link|login here|reset your account)\b/i,
    weight: 15,
    message: "Action-oriented link or verification language detected."
  },
  {
    regex: /\b(prize|winner|won|reward|free gift|claim your)\b/i,
    weight: 15,
    message: "Prize or reward bait language detected."
  },
  {
    regex: /\b(account (blocked|suspended|locked|disabled)|unusual activity|unauthorized access)\b/i,
    weight: 20,
    message: "Account-threat or security-alert language detected."
  },
  {
    regex: /https?:\/\/[^\s]+/i,
    weight: 10,
    message: "A web link was included in the email content."
  },
  {
    regex: /\b(secret|confidential|don't tell|do not share)\b/i,
    weight: 10,
    message: "Sensitive or secrecy-related language detected."
  }
];

document.getElementById("emailForm").addEventListener("submit", e => {
  e.preventDefault();

  const sender = document.getElementById("emailSender").value.trim();
  const subject = document.getElementById("emailSubject").value.trim();
  const body = document.getElementById("emailBody").value.trim();

  if (!sender && !subject && !body) {
    showToast("Please enter email details first.");
    return;
  }

  const combined = `${sender} ${subject} ${body}`;
  const result = analyzeIndicators(combined, emailRules);

  // Additional sender checks
  if (sender && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender)) {
    result.score += 10;
    result.findings.push("Sender address has an unusual format.");
  }

  if (sender && /(gmail|yahoo|outlook|hotmail)\.com$/i.test(sender)) {
    result.findings.push(
      "Sender uses a public email provider. This alone is not suspicious."
    );
  }

  result.score = clampScore(result.score);
  result.severity = getSeverity(result.score);

  if (result.findings.length === 0) {
    result.findings.push("No configured suspicious indicators were detected.");
  }

  result.recommendation = getRecommendation(result.severity);
  result.type = "Email";
  result.item = sender || subject || "Email submission";
  result.details = `Subject: ${subject || "Not provided"}`;

  addScan(result);
  showResult(result);
  e.target.reset();
});

// ---------- URL ANALYZER ----------
const urlRules = [
  {
    regex: /(login|verify|secure|account|update|signin|banking)/i,
    weight: 15,
    message: "URL contains words commonly used in login or verification lures."
  },
  {
    regex: /https?:\/\/\d{1,3}(\.\d{1,3}){3}/i,
    weight: 30,
    message: "URL uses an IP address instead of a conventional domain name."
  },
  {
    regex: /https?:\/\/[^/]*@/i,
    weight: 25,
    message: "URL contains an @ symbol in the authority section."
  },
  {
    regex: /https?:\/\/[^/]*-[^/]*-[^/]*\.[a-z]{2,}/i,
    weight: 15,
    message: "Domain contains multiple hyphens."
  },
  {
    regex: /https?:\/\/[^/]*\.(tk|ml|ga|cf|gq|top|xyz|click|work|zip)(\/|$)/i,
    weight: 20,
    message: "Domain uses an extension that may warrant extra scrutiny."
  },
  {
    regex: /https?:\/\/[^/]*\.(com|net|org)\.[a-z]{2,}/i,
    weight: 20,
    message: "Domain has an unusual multi-suffix pattern."
  },
  {
    regex: /https?:\/\/[^/]*\.(bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly|rb\.gy)\//i,
    weight: 20,
    message: "URL appears to use a link-shortening service."
  }
];

document.getElementById("urlForm").addEventListener("submit", e => {
  e.preventDefault();

  const input = document.getElementById("urlInput").value.trim();

  let parsed;
  try {
    parsed = new URL(input);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Unsupported URL protocol");
    }
  } catch {
    showToast("Enter a valid HTTP or HTTPS URL.");
    return;
  }

  let result = analyzeIndicators(input, urlRules);

  if (input.length > 100) {
    result.score += 10;
    result.findings.push("URL is unusually long.");
  }

  if (parsed.protocol !== "https:") {
    result.score += 15;
    result.findings.push("URL does not use HTTPS encryption.");
  }

  if (parsed.hostname.split(".").length > 4) {
    result.score += 15;
    result.findings.push("URL contains many subdomain levels.");
  }

  if (/[^\w\-./:?=&%]/.test(input)) {
    result.score += 10;
    result.findings.push("URL contains unusual characters.");
  }

  result.score = clampScore(result.score);
  result.severity = getSeverity(result.score);

  if (result.findings.length === 0) {
    result.findings.push("No configured suspicious URL patterns were detected.");
  }

  result.recommendation = getRecommendation(result.severity);
  result.type = "URL";
  result.item = input;
  result.details = `Domain: ${parsed.hostname}`;

  addScan(result);
  showResult(result);
});

// ---------- FILE SCANNER ----------
const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");

document.getElementById("browseBtn").addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", e => {
  if (e.target.files.length) scanFile(e.target.files[0]);
});

dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  if (e.dataTransfer.files.length) {
    scanFile(e.dataTransfer.files[0]);
  }
});

async function scanFile(file) {
  if (file.size > 10 * 1024 * 1024) {
    showToast("File is larger than the 10 MB limit.");
    fileInput.value = "";
    return;
  }

  const extension = file.name.split(".").pop().toLowerCase();
  const suspiciousExtensions = [
    "exe", "dll", "bat", "cmd", "ps1", "vbs",
    "js", "jar", "msi", "scr", "com", "pif"
  ];

  const riskyExtensions = [
    "zip", "rar", "7z", "iso", "img"
  ];

  let score = 0;
  const findings = [];

  if (suspiciousExtensions.includes(extension)) {
    score += 60;
    findings.push(`File extension .${extension} can be executable or script-based.`);
  }

  if (riskyExtensions.includes(extension)) {
    score += 20;
    findings.push("Archive or disk-image file type may contain additional files.");
  }

  if (file.name.includes(" ")) {
    findings.push("File name contains spaces.");
  }

  if (file.name.length > 100) {
    score += 10;
    findings.push("File name is unusually long.");
  }

  if (!file.type) {
    score += 10;
    findings.push("File MIME type is not identified by the browser.");
  }

  let hash = "Unavailable";

  try {
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    hash = Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    findings.push("SHA-256 calculation was unavailable.");
  }

  score = clampScore(score);

  const severity = getSeverity(score);

  if (findings.length === 0) {
    findings.push("No configured suspicious file indicators were detected.");
  }

  const result = {
    type: "File",
    item: file.name,
    details: `${file.type || "Unknown MIME"} • ${(file.size / 1024).toFixed(2)} KB`,
    score,
    severity,
    findings,
    recommendation: getRecommendation(severity),
    hash
  };

  addScan(result);
  showResult(result);
  fileInput.value = "";
}

// ---------- RECOMMENDATIONS ----------
function getRecommendation(severity) {
  switch (severity) {
    case "Critical":
      return "Avoid interacting with this item. Do not click links, share credentials, or open files. Verify through an independent trusted channel.";
    case "High":
      return "Exercise extreme caution. Verify the sender or domain independently before taking action.";
    case "Medium":
      return "Review the suspicious indicators carefully. Avoid entering sensitive information until you verify the item.";
    case "Low":
      return "Some indicators deserve attention. Verify context and source before proceeding.";
    default:
      return "No configured high-risk indicators were detected. This does not guarantee the item is safe.";
  }
}

// ---------- RESULT MODAL ----------
function showResult(result) {
  lastResult = result;

  const color = getSeverityColor(result.severity);

  const content = `
    <div class="result-header">
      <div class="result-icon" style="color:${color}">
        <i class="fa-solid ${
          result.severity === "Safe" || result.severity === "Low"
            ? "fa-shield-check"
            : "fa-triangle-exclamation"
        }"></i>
      </div>
      <h2>${escapeHTML(result.severity)} Risk</h2>
      <p>${escapeHTML(result.type)} analysis completed</p>
      <div class="score-ring"
        style="--score-color:${color};--score-angle:${result.score * 3.6}deg">
        <strong>${result.score}<small>/100</small></strong>
      </div>
      <span class="status-badge ${getSeverityClass(result.severity)}">
        ${escapeHTML(result.severity.toUpperCase())}
      </span>
    </div>

    <div class="result-section">
      <h3>Analyzed Item</h3>
      <div class="result-indicator">
        <i class="fa-solid ${getIcon(result.type)}"></i>
        <span style="overflow-wrap:anywhere">${escapeHTML(result.item)}</span>
      </div>
      ${
        result.details
          ? `<div class="result-indicator">${escapeHTML(result.details)}</div>`
          : ""
      }
    </div>

    ${
      result.hash
        ? `<div class="result-section">
             <h3>SHA-256 Hash</h3>
             <div class="result-indicator" style="overflow-wrap:anywhere">
               ${escapeHTML(result.hash)}
             </div>
           </div>`
        : ""
    }

    <div class="result-section">
      <h3>Detected Indicators (${result.findings.length})</h3>
      ${result.findings.map(f => `
        <div class="result-indicator">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>${escapeHTML(f)}</span>
        </div>
      `).join("")}
    </div>

    <div class="result-section">
      <h3>Recommendation</h3>
      <div class="recommendation">
        <i class="fa-solid fa-shield-halved"></i>
        ${escapeHTML(result.recommendation)}
      </div>
    </div>

    <div class="result-actions">
      <button class="btn btn-primary" onclick="downloadReport(lastResult)">
        <i class="fa-solid fa-file-pdf"></i> Download PDF
      </button>
      <button class="btn btn-ghost" onclick="closeModal()">
        Close
      </button>
    </div>
  `;

  document.getElementById("resultContent").innerHTML = content;
  document.getElementById("resultModal").classList.add("show");
}

function closeModal() {
  document.getElementById("resultModal").classList.remove("show");
}

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("resultModal").addEventListener("click", e => {
  if (e.target.id === "resultModal") closeModal();
});

// ---------- PDF REPORT ----------
function downloadReport(result) {
  if (!result) return;

  if (!window.jspdf) {
    showToast("PDF library is unavailable.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.setFillColor(10, 16, 30);
  pdf.rect(0, 0, 210, 35, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.text("CyberShield AI", 15, 16);

  pdf.setFontSize(10);
  pdf.text("CYBER THREAT ANALYSIS REPORT", 15, 25);

  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(15);
  pdf.text("Scan Report", 15, 48);

  pdf.setFontSize(11);
  pdf.text(`Item: ${String(result.item).slice(0, 85)}`, 15, 60);
  pdf.text(`Type: ${result.type}`, 15, 69);
  pdf.text(`Risk Score: ${result.score}/100`, 15, 78);
  pdf.text(`Severity: ${result.severity}`, 15, 87);
  pdf.text(`Date: ${new Date().toLocaleString()}`, 15, 96);

  let y = 110;
  pdf.setFontSize(13);
  pdf.text("Detected Indicators", 15, y);
  y += 9;

  pdf.setFontSize(10);
  result.findings.forEach((finding, index) => {
    const lines = pdf.splitTextToSize(`${index + 1}. ${finding}`, 175);
    pdf.text(lines, 18, y);
    y += lines.length * 6 + 3;

    if (y > 255) {
      pdf.addPage();
      y = 20;
    }
  });

  y += 5;
  pdf.setFontSize(13);
  pdf.text("Recommendation", 15, y);
  y += 8;

  pdf.setFontSize(10);
  const recommendationLines = pdf.splitTextToSize(result.recommendation, 175);
  pdf.text(recommendationLines, 15, y);

  if (result.hash) {
    y += recommendationLines.length * 6 + 8;
    pdf.setFontSize(12);
    pdf.text("SHA-256", 15, y);
    y += 7;
    pdf.setFontSize(9);
    pdf.text(pdf.splitTextToSize(result.hash, 175), 15, y);
  }

  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    "Disclaimer: Heuristic browser analysis only. This report is not a validated antivirus verdict.",
    15, 285
  );

  pdf.save("CyberShield-Scan-Report.pdf");
  showToast("PDF report downloaded.");
}

// ---------- DASHBOARD ----------
function updateDashboard() {
  const total = scans.length;
  const threats = scans.filter(s => s.score >= 60).length;
  const safe = scans.filter(s => s.score < 15).length;
  const avg = total
    ? Math.round(scans.reduce((sum, s) => sum + s.score, 0) / total)
    : 0;

  document.getElementById("totalScans").textContent = total;
  document.getElementById("threatCount").textContent = threats;
  document.getElementById("safeCount").textContent = safe;
  document.getElementById("avgRisk").textContent = avg + "%";

  renderRecent();
  renderDashboardCharts();
}

function renderRecent() {
  const tbody = document.getElementById("recentTable");

  if (!scans.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty">No scans performed yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = scans.slice(0, 5).map(scan => `
    <tr>
      <td><span class="item-name"><i class="fa-solid ${getIcon(scan.type)} item-icon"></i>${escapeHTML(scan.item)}</span></td>
      <td>${escapeHTML(scan.type)}</td>
      <td>${new Date(scan.date).toLocaleString()}</td>
      <td class="risk-number" style="color:${getSeverityColor(scan.severity)}">${scan.score}%</td>
      <td><span class="status-badge ${getSeverityClass(scan.severity)}">${escapeHTML(scan.severity)}</span></td>
    </tr>
  `).join("");
}

// ---------- CHARTS ----------
function destroyChart(id) {
  if (charts[id]) {
    charts[id].destroy();
    charts[id] = null;
  }
}

function chartDefaults() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#a1afc5",
          font: { size: 10 }
        }
      }
    }
  };
}

function renderDashboardCharts() {
  if (!window.Chart) return;

  const activityCanvas = document.getElementById("activityChart");
  const distributionCanvas = document.getElementById("distributionChart");

  if (!activityCanvas || !distributionCanvas) return;

  destroyChart("activity");
  destroyChart("distribution");

  const recent = scans.slice(0, 7).reverse();

  charts.activity = new Chart(activityCanvas, {
    type: "line",
    data: {
      labels: recent.map(s =>
        new Date(s.date).toLocaleDateString([], { month: "short", day: "numeric" })
      ),
      datasets: [{
        label: "Risk Score",
        data: recent.map(s => s.score),
        borderColor: "#4b8bff",
        backgroundColor: "#4b8bff25",
        fill: true,
        tension: .35,
        pointRadius: 4
      }]
    },
    options: {
      ...chartDefaults(),
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: "#202b3d" },
          ticks: { color: "#74849d" }
        },
        x: {
          grid: { display: false },
          ticks: { color: "#74849d" }
        }
      }
    }
  });

  const typeCounts = {
    Email: scans.filter(s => s.type === "Email").length,
    URL: scans.filter(s => s.type === "URL").length,
    File: scans.filter(s => s.type === "File").length
  };

  charts.distribution = new Chart(distributionCanvas, {
    type: "doughnut",
    data: {
      labels: Object.keys(typeCounts),
      datasets: [{
        data: Object.values(typeCounts),
        backgroundColor: ["#4b8bff", "#29d9e8", "#a78bfa"],
        borderColor: "#111827",
        borderWidth: 3
      }]
    },
    options: {
      ...chartDefaults(),
      cutout: "70%"
    }
  });
}

// ---------- HISTORY ----------
function renderHistory() {
  const tbody = document.getElementById("historyTable");
  const query = (document.getElementById("historySearch").value || "").toLowerCase();
  const filter = document.getElementById("historyFilter").value;

  const filtered = scans.filter(scan => {
    const matchesQuery =
      scan.item.toLowerCase().includes(query) ||
      scan.type.toLowerCase().includes(query) ||
      scan.severity.toLowerCase().includes(query);

    const matchesType = filter === "all" || scan.type === filter;
    return matchesQuery && matchesType;
  });

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">No matching scans found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(scan => `
    <tr>
      <td><span class="item-name"><i class="fa-solid ${getIcon(scan.type)} item-icon"></i>${escapeHTML(scan.item)}</span></td>
      <td>${escapeHTML(scan.type)}</td>
      <td>${new Date(scan.date).toLocaleString()}</td>
      <td class="risk-number" style="color:${getSeverityColor(scan.severity)}">${scan.score}%</td>
      <td><span class="status-badge ${getSeverityClass(scan.severity)}">${escapeHTML(scan.severity)}</span></td>
      <td><button class="btn btn-ghost" onclick="deleteScan('${scan.id}')"><i class="fa-solid fa-trash"></i></button></td>
    </tr>
  `).join("");
}

document.getElementById("historySearch").addEventListener("input", renderHistory);
document.getElementById("historyFilter").addEventListener("change", renderHistory);

function deleteScan(id) {
  scans = scans.filter(s => s.id !== id);
  saveScans();
  renderHistory();
  updateDashboard();
  showToast("Scan record deleted.");
}

document.getElementById("clearHistory").addEventListener("click", () => {
  if (!scans.length) {
    showToast("History is already empty.");
    return;
  }

  if (confirm("Delete all scan history from this browser?")) {
    scans = [];
    saveScans();
    renderHistory();
    updateDashboard();
    renderAnalytics();
    showToast("Scan history cleared.");
  }
});

// ---------- ANALYTICS ----------
function renderAnalytics() {
  document.getElementById("analyticsTotal").textContent = scans.length;
  document.getElementById("analyticsHigh").textContent =
    scans.filter(s => s.score >= 60).length;
  document.getElementById("analyticsMedium").textContent =
    scans.filter(s => s.score >= 35 && s.score < 60).length;
  document.getElementById("analyticsLow").textContent =
    scans.filter(s => s.score < 35).length;

  if (!window.Chart) return;

  destroyChart("risk");
  destroyChart("types");

  const riskCanvas = document.getElementById("riskChart");
  const typeCanvas = document.getElementById("typeChart");

  charts.risk = new Chart(riskCanvas, {
    type: "bar",
    data: {
      labels: ["Safe", "Low", "Medium", "High", "Critical"],
      datasets: [{
        label: "Scans",
        data: [
          scans.filter(s => s.severity === "Safe").length,
          scans.filter(s => s.severity === "Low").length,
          scans.filter(s => s.severity === "Medium").length,
          scans.filter(s => s.severity === "High").length,
          scans.filter(s => s.severity === "Critical").length
        ],
        backgroundColor: ["#36d399", "#4b8bff", "#ffbf55", "#ff5570", "#cc3150"],
        borderRadius: 5
      }]
    },
    options: {
      ...chartDefaults(),
      scales: {
        y: { beginAtZero: true, grid: { color: "#202b3d" }, ticks: { color: "#74849d" } },
        x: { grid: { display: false }, ticks: { color: "#74849d" } }
      }
    }
  });

  charts.types = new Chart(typeCanvas, {
    type: "pie",
    data: {
      labels: ["Email", "URL", "File"],
      datasets: [{
        data: [
          scans.filter(s => s.type === "Email").length,
          scans.filter(s => s.type === "URL").length,
          scans.filter(s => s.type === "File").length
        ],
        backgroundColor: ["#4b8bff", "#29d9e8", "#a78bfa"]
      }]
    },
    options: chartDefaults()
  });
}

// ---------- INITIALIZATION ----------
document.addEventListener("DOMContentLoaded", () => {
  updateDashboard();
  renderHistory();
  renderAnalytics();
});
