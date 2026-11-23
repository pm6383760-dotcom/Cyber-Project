import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  ExternalLink, 
  Download, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles,
  Info,
  Shield
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import RiskGauge from '../components/RiskGauge';
import ScanRadar from '../components/ScanRadar';
import IndicatorBadge from '../components/IndicatorBadge';
import FeatureBreakdown from '../components/FeatureBreakdown';
import ExportReportModal from '../components/ExportReportModal';

const DashboardPage = () => {
  const [urlInput, setUrlInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const { currentScan, isScanning, scanStep, scanError, scanUrl, setCurrentScan } = useScan();

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    try {
      await scanUrl(urlInput);
    } catch (err) {
      // Error handled in context
    }
  };

  const handleQuickSelect = (url) => {
    setUrlInput(url);
    scanUrl(url);
  };

  const handleCopySha256 = () => {
    if (currentScan?.sha256) {
      navigator.clipboard.writeText(currentScan.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const samplePresets = [
    { label: 'Google Search (Legitimate)', url: 'https://www.google.com', risk: 'low' },
    { label: 'PayPal Spoof (Phishing)', url: 'http://secure-paypal-login-verify.com.xyz/account/update', risk: 'high' },
    { label: 'Bank IP Direct (Phishing)', url: 'http://192.168.1.105:8080/bank/login.php', risk: 'high' },
    { label: 'Deep Subdomain Spoof', url: 'https://appleid.apple.com.verify-billing-notice.tk/auth', risk: 'high' }
  ];

  const isPhishing = currentScan?.prediction === 'PHISHING';
  const isSuspicious = currentScan?.prediction === 'SUSPICIOUS';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyber-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
              REAL-TIME SCANNER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            AI-Powered URL Threat Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Extracts 22 lexical vectors & analyzes threat probability using Random Forest ML
          </p>
        </div>

        {currentScan && (
          <button
            onClick={() => setShowExportModal(true)}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-950/60 text-cyan-300 font-semibold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Generate Security Report (PDF)</span>
          </button>
        )}
      </div>

      {/* URL Input Box */}
      <div className="p-6 rounded-3xl bg-cyber-card border border-cyber-border shadow-2xl relative overflow-hidden">
        <form onSubmit={handleScanSubmit} className="space-y-4">
          <div className="relative flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter suspect URL (e.g. http://secure-update-login.com.xyz)..."
                disabled={isScanning}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-white text-sm focus:outline-none focus:border-cyan-400 font-mono transition-colors disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning || !urlInput.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
            >
              <span>{isScanning ? 'Analyzing...' : 'Scan URL'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Buttons for Viva Demos */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Viva Test Samples:
            </span>
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickSelect(preset.url)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all ${
                  preset.risk === 'low'
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40'
                    : 'border-rose-500/30 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </form>

        {scanError && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{scanError}</span>
          </div>
        )}
      </div>

      {/* Scanning Radar Animation during scan */}
      {isScanning && <ScanRadar currentStep={scanStep} />}

      {/* Scan Results Display */}
      {currentScan && !isScanning && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Threat Verdict Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-cyber-card border border-cyber-border shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Left Column: Risk Gauge */}
              <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-cyber-border pb-6 lg:pb-0 lg:pr-6">
                <RiskGauge
                  score={currentScan.riskScore}
                  level={currentScan.riskLevel}
                  size={190}
                />
              </div>

              {/* Middle & Right: Verdict and Details */}
              <div className="lg:col-span-2 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${
                      isPhishing
                        ? 'bg-rose-950/60 border border-rose-500/40 text-rose-400'
                        : isSuspicious
                        ? 'bg-amber-950/60 border border-amber-500/40 text-amber-400'
                        : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400'
                    }`}>
                      {isPhishing ? (
                        <ShieldAlert className="w-7 h-7" />
                      ) : isSuspicious ? (
                        <AlertTriangle className="w-7 h-7" />
                      ) : (
                        <ShieldCheck className="w-7 h-7" />
                      )}
                    </div>

                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        Classification Verdict
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                        {currentScan.prediction}
                      </h2>
                    </div>
                  </div>

                  {/* Confidence Badge */}
                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      ML Confidence
                    </span>
                    <span className="text-base font-bold font-mono text-cyan-300">
                      {currentScan.confidence}%
                    </span>
                  </div>
                </div>

                {/* Scanned URL pill */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
                    Target URL Analyzed
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-mono text-cyan-400 break-all select-all">
                      {currentScan.url}
                    </p>
                  </div>
                </div>

                {/* Metadata Row: SHA-256 & Engine */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono block">
                      SHA-256 Fingerprint
                    </span>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="font-mono text-slate-300 truncate text-[11px]">
                        {currentScan.sha256}
                      </span>
                      <button
                        onClick={handleCopySha256}
                        className="text-slate-400 hover:text-cyan-400 p-1 rounded"
                        title="Copy SHA-256"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono block">
                      ML Classifier Architecture
                    </span>
                    <p className="font-mono text-cyan-300 truncate text-[11px] mt-0.5">
                      {currentScan.engineUsed}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicators & Explainable AI Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Suspicious Indicators Flagged */}
            <div className="p-6 rounded-3xl bg-cyber-card border border-cyber-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyber-border">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-cyan-400" />
                  <span>Detected Threat Indicators ({currentScan.indicators?.length || 0})</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Weight Impact</span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {(currentScan.indicators || []).map((indicator, idx) => (
                  <IndicatorBadge key={idx} indicator={indicator} />
                ))}
              </div>
            </div>

            {/* Explainable AI (XAI) Reasons & Safety Advice */}
            <div className="p-6 rounded-3xl bg-cyber-card border border-cyber-border space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-3 border-b border-cyber-border">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Explainable AI (XAI) Prediction Reasons</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct explainability factors derived from the Random Forest model features
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  {(currentScan.reasons || []).map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-cyan-400 font-mono font-bold mt-0.5">[{idx + 1}]</span>
                      <span className="leading-relaxed">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Recommendations */}
              <div className="pt-4 border-t border-cyber-border space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Recommended Incident Actions
                </h4>
                <div className="space-y-1.5">
                  {(currentScan.recommendations || []).map((rec, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <Shield className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 22 Features Breakdown Accordion */}
          <FeatureBreakdown features={currentScan.features} />

          {/* Mandatory Academic Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-300">Academic & Security Disclaimer:</strong> PhishGuard AI calculates threat scores based on statistical machine learning models and structural heuristics. Predictions are probabilistic and do not provide an infallible guarantee that a website is benign or compromised. Always maintain browser vigilance.
            </p>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {showExportModal && currentScan && (
        <ExportReportModal
          scan={currentScan}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
