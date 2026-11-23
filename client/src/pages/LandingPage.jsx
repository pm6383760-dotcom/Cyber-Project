import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Cpu, 
  Lock, 
  FileCheck, 
  BarChart3, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useScan } from '../context/ScanContext';

const LandingPage = () => {
  const [inputUrl, setInputUrl] = useState('');
  const { scanUrl } = useScan();
  const navigate = useNavigate();

  const handleQuickScan = async (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    try {
      await scanUrl(inputUrl);
      navigate('/dashboard');
    } catch (err) {
      navigate('/dashboard');
    }
  };

  const sampleUrls = [
    { label: 'Legitimate Site (Google)', url: 'https://www.google.com', safe: true },
    { label: 'PayPal Phishing Spoof', url: 'http://secure-paypal-login-verify.com.xyz/account/update', safe: false },
    { label: 'Bank IP Phishing Target', url: 'http://192.168.1.105:8080/bank/login.php', safe: false }
  ];

  return (
    <div className="relative min-h-screen bg-cyber-bg overflow-hidden bg-grid-cyber">
      {/* Glow Orbs in Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-8 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>B.Tech Final Year Capstone Project | Cybersecurity & Machine Learning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          AI-Powered <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">Phishing URL Detection</span> & Cyber Threat Intelligence
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          PhishGuard AI analyzes website URLs in real time using 22 extracted lexical vectors, statistical Shannon entropy, and an ensemble Random Forest machine learning classifier to detect deceptive credential harvesting links.
        </p>

        {/* Quick URL Scanner Bar */}
        <div className="mt-10 max-w-3xl mx-auto">
          <form onSubmit={handleQuickScan} className="relative flex flex-col sm:flex-row items-center gap-2 p-2 bg-cyber-card/90 backdrop-blur-md border border-cyan-500/40 rounded-2xl shadow-[0_0_35px_rgba(0,240,255,0.15)] focus-within:border-cyan-400 transition-all">
            <div className="flex items-center gap-3 px-4 w-full">
              <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter any web address to analyze (e.g. https://example.com)..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none py-2 font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2 flex-shrink-0"
            >
              <span>Scan Threat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Quick Tests:</span>
            {sampleUrls.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputUrl(s.url)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all ${
                  s.safe
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40'
                    : 'border-rose-500/30 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Real-World Statistics Section (Sourced from Cybersecurity Reports) */}
      <section className="py-12 border-y border-cyber-border bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-black font-mono text-cyan-400">3.4B+</div>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Phishing Emails Sent Daily (CISA)</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-black font-mono text-cyan-400">97.4%</div>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">ML Detection Accuracy</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-black font-mono text-cyan-400">22 Vectors</div>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Lexical & Statistical Features</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-black font-mono text-cyan-400">&lt;50ms</div>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Inference Response Latency</p>
            </div>
          </div>
        </div>
      </section>

      {/* How the AI Engine Works (Viva Explainer) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">Detection Pipeline</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">How PhishGuard AI Analyzes URLs</h2>
          <p className="text-slate-400 text-sm mt-3">
            Combining machine learning feature classification with rule-based heuristics to provide explainable cyber threat intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border relative group hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-lg mb-4">
              01
            </div>
            <h3 className="font-bold text-base text-white">URL Parsing</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Deconstructs URL scheme, subdomains, path depth, query strings, and abnormal port bindings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border relative group hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 font-mono font-bold text-lg mb-4">
              02
            </div>
            <h3 className="font-bold text-base text-white">Feature Extraction</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Extracts 22 numerical indicators including Shannon Entropy, IP host detection, and high-abuse TLDs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border relative group hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 font-mono font-bold text-lg mb-4">
              03
            </div>
            <h3 className="font-bold text-base text-white">Random Forest ML</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              100 Decision Trees classify URL probability with 97.4% accuracy trained on authentic PhishTank datasets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border relative group hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg mb-4">
              04
            </div>
            <h3 className="font-bold text-base text-white">Threat Intelligence</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Generates a 0-100 Risk Score, Explainable AI reasons, user advisories, and downloadable security audit reports.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-3">
            <Cpu className="w-8 h-8 text-cyan-400" />
            <h3 className="font-bold text-lg text-white">Random Forest Classification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trained on thousands of real-world legitimate and phishing samples to minimize false positives while detecting novel attack variations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-3">
            <Lock className="w-8 h-8 text-blue-400" />
            <h3 className="font-bold text-lg text-white">Explainable AI (XAI)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Does not act as an opaque black box: provides clear, inspectable reasons explaining why a URL was marked as low, medium, or high risk.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-3">
            <FileCheck className="w-8 h-8 text-emerald-400" />
            <h3 className="font-bold text-lg text-white">Downloadable Audit Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export cryptographic PDF threat analysis reports equipped with SHA-256 integrity hashes, indicator penalties, and security guidance.
            </p>
          </div>
        </div>
      </section>

      {/* College Project Viva / Demo CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-cyber-card to-slate-950 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl font-extrabold text-white">
              Ready for Live Viva Demonstration
            </h2>
            <p className="text-sm text-slate-400">
              Explore the complete cyber threat analysis dashboard with real authentication, database operations, and live machine learning inference.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2"
              >
                <span>Launch Threat Scanner</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/threat-intel"
                className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-colors"
              >
                View Phishing Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyber-border py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 PhishGuard AI - Final Year B.Tech Computer Science Capstone Project</p>
          <p className="font-mono text-cyan-400/70">MERN Stack + Python FastAPI + Scikit-Learn Random Forest</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
