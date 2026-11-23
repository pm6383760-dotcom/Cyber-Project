import React from 'react';
import { jsPDF } from 'jspdf';
import { Download, FileText, CheckCircle2, AlertTriangle, X, Shield, Printer } from 'lucide-react';

const ExportReportModal = ({ scan, onClose }) => {
  if (!scan) return null;

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Background header banner
    doc.setFillColor(11, 15, 25);
    doc.rect(0, 0, pageWidth, 42, 'F');

    // Title
    doc.setTextColor(0, 240, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PHISHGUARD AI - CYBER THREAT REPORT', 14, 20);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('AI-Powered Phishing URL Detection & Threat Intelligence Incident File', 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString()} | ID: ${scan.id || scan._id || 'N/A'}`, 14, 34);

    let y = 52;

    // Scan Overview Box
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(14, y, pageWidth - 28, 45, 3, 3, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, y, pageWidth - 28, 45, 3, 3, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TARGET URL & METADATA', 20, y + 10);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Target URL: ${scan.url}`, 20, y + 18);
    doc.text(`Domain: ${scan.domain || 'N/A'}`, 20, y + 25);
    doc.text(`SHA-256 Fingerprint: ${scan.sha256 || 'N/A'}`, 20, y + 32);
    doc.text(`ML Engine: ${scan.engineUsed || 'PhishGuard AI Random Forest Ensemble'}`, 20, y + 39);

    y += 55;

    // Threat Assessment Summary Box
    const isPhishing = scan.prediction === 'PHISHING';
    doc.setFillColor(isPhishing ? 254 : 240, isPhishing ? 242 : 253, isPhishing ? 242 : 244);
    doc.roundedRect(14, y, pageWidth - 28, 30, 3, 3, 'F');
    doc.setDrawColor(isPhishing ? 239 : 16, isPhishing ? 68 : 185, isPhishing ? 68 : 129);
    doc.roundedRect(14, y, pageWidth - 28, 30, 3, 3, 'S');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isPhishing ? 220 : 5, isPhishing ? 38 : 150, isPhishing ? 38 : 105);
    doc.text(`VERDICT: ${scan.prediction} (${scan.riskLevel} RISK - ${scan.riskScore}/100)`, 20, y + 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Model Confidence: ${scan.confidence}% | Statistical Risk Score: ${scan.riskScore} / 100`, 20, y + 22);

    y += 40;

    // Indicators
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SUSPICIOUS INDICATORS IDENTIFIED', 14, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    if (scan.indicators && scan.indicators.length > 0) {
      scan.indicators.forEach((ind, i) => {
        doc.text(`• [${ind.severity.toUpperCase()}] ${ind.name}: ${ind.description}`, 16, y);
        y += 6;
      });
    } else {
      doc.text('• No suspicious heuristics or threat indicators flagged.', 16, y);
      y += 6;
    }

    y += 6;

    // Explainability Reasons
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('EXPLAINABLE AI REASONS (XAI)', 14, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    if (scan.reasons && scan.reasons.length > 0) {
      scan.reasons.forEach(r => {
        const lines = doc.splitTextToSize(`• ${r}`, pageWidth - 32);
        doc.text(lines, 16, y);
        y += lines.length * 5 + 1;
      });
    }

    y += 6;

    // Safety Recommendations
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('INCIDENT MITIGATION & SAFETY RECOMMENDATIONS', 14, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    if (scan.recommendations && scan.recommendations.length > 0) {
      scan.recommendations.forEach(rec => {
        const lines = doc.splitTextToSize(`- ${rec}`, pageWidth - 32);
        doc.text(lines, 16, y);
        y += lines.length * 5 + 1;
      });
    }

    y += 8;

    // Mandatory Academic / Regulatory Disclaimer
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    const disclaimer = "DISCLAIMER: PhishGuard AI is an academic cybersecurity demonstration system utilizing machine learning and rule-based heuristics. Predictions are probabilistic and do not guarantee safety. Do not rely solely on this automated report for commercial security operations.";
    const discLines = doc.splitTextToSize(disclaimer, pageWidth - 28);
    doc.text(discLines, 14, y);

    // Save PDF
    doc.save(`PhishGuard-Threat-Report-${Date.now()}.pdf`);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PhishGuard-Threat-Scan-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-cyber-card border border-cyber-border rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Generate Threat Intelligence Report</h3>
              <p className="text-xs text-slate-400">Export audited scan incident document</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Preview */}
        <div className="my-6 space-y-4 max-h-[50vh] overflow-y-auto pr-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Target Link</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                scan.prediction === 'PHISHING' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {scan.prediction} ({scan.riskScore}/100)
              </span>
            </div>
            <p className="text-sm font-mono text-cyan-300 break-all">{scan.url}</p>
            <p className="text-[11px] font-mono text-slate-500">SHA-256: {scan.sha256}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Explainability Summary</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              {(scan.reasons || []).slice(0, 3).map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyber-border">
          <button
            onClick={handleDownloadJson}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            JSON Format
          </button>
          <button
            onClick={handleDownloadPdf}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportReportModal;
