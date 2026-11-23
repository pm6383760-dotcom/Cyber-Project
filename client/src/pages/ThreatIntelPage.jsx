import React from 'react';
import { 
  BookOpen, 
  ShieldAlert, 
  ExternalLink, 
  Terminal, 
  HelpCircle, 
  CheckCircle2, 
  Lock, 
  AlertTriangle 
} from 'lucide-react';

const ThreatIntelPage = () => {
  const attackVectors = [
    {
      title: 'Typosquatting & Combosquatting',
      severity: 'HIGH',
      description: 'Attackers register domain names that differ by a single typo, hyphen, or added word from a legitimate brand (e.g. paypa1.com or paypal-security-update.com).',
      example: 'http://secure-paypal-login.com.xyz',
      countermeasure: 'Use bookmark links, password managers with strict domain matching, and check domain labels preceding the TLD.'
    },
    {
      title: 'Raw IP Host Routing',
      severity: 'CRITICAL',
      description: 'URLs hosting login forms directly on raw IPv4 or IPv6 addresses rather than registered DNS names to evade domain registration audits and take-downs.',
      example: 'http://192.168.1.105:8080/bank/login.php',
      countermeasure: 'Legitimate institutions almost never authenticate customers via raw IP addresses. Immediately abort.'
    },
    {
      title: 'Subdomain Stacking / Masking',
      severity: 'HIGH',
      description: 'Creating excessive subdomains containing the target brand name to push the true destination domain off-screen on mobile viewports.',
      example: 'https://paypal.com.account-verification.suspicious-host.net',
      countermeasure: 'Inspect the right-most domain segment immediately preceding the TLD (e.g., in above, suspicious-host.net is the true host).'
    },
    {
      title: 'High-Abuse Top-Level Domains (TLDs)',
      severity: 'MEDIUM',
      description: 'Disproportionately high phishing campaigns leverage ultra-low-cost or non-verified TLDs (.xyz, .top, .buzz, .tk, .click, .loan).',
      example: 'https://verify-apple-id.buzz/index.html',
      countermeasure: 'Exercise elevated caution when receiving links ending in unvetted or unfamiliar extensions.'
    },
    {
      title: 'High Shannon Entropy & DGA Obfuscation',
      severity: 'MEDIUM',
      description: 'Malicious threat actors employ Domain Generation Algorithms (DGAs) with high character randomness to bypass static blocklists.',
      example: 'http://xj89q-k129-plq98a.net/token?x=981298',
      countermeasure: 'Shannon Entropy mathematically calculates character randomness. Entropy > 4.4 denotes high algorithmic generation probability.'
    },
    {
      title: '@ Symbol Deceptive Redirection',
      severity: 'HIGH',
      description: 'Under RFC 3986, characters preceding an "@" symbol represent userinfo. Browsers ignore everything before "@" and navigate to the domain after it.',
      example: 'http://google.com@malicious-credential-harvest.com',
      countermeasure: 'Modern browsers flag "@" URLs. PhishGuard automatically penalizes this signature with maximum threat severity.'
    }
  ];

  const vivaQuestions = [
    {
      q: 'Why use Random Forest instead of Deep Learning (LSTM/CNN)?',
      a: 'Random Forest outperforms deep learning on tabular lexical features because it does not require millions of training samples, prevents overfitting via decision-tree bagging, computes exact feature importances for Explainable AI (XAI), and runs with sub-5ms inference latency.'
    },
    {
      q: 'What is Shannon Entropy and why is it useful in URL detection?',
      a: 'Shannon Entropy quantifies the uncertainty or randomness of characters in a string. Legitimate domain names follow phonetic human language with low entropy (~2.5–3.8). Malicious DGA domains and obfuscated token paths exhibit high entropy (>4.3).'
    },
    {
      q: 'How does PhishGuard AI prevent false positives on major portals?',
      a: 'PhishGuard uses a dual-engine architecture: a high-trust verification layer for globally vetted authoritative roots combined with heuristic feature validation so genuine login portals (like accounts.google.com) are not misclassified.'
    },
    {
      q: 'Why are lexical features analyzed rather than scraping the page content?',
      a: 'Content scraping is slow, triggers active malware scripts on the server, and fails when phishers employ IP cloaking or CAPTCHAs. Lexical analysis is instantaneous, non-invasive, and detects malicious patterns before network connection occurs.'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="pb-6 border-b border-cyber-border">
        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
          EDUCATIONAL GUIDE
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
          Phishing Attack Vectors & Threat Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Comprehensive cybersecurity encyclopedia for academic presentations, viva preparation, and security awareness
        </p>
      </div>

      {/* Attack Vectors Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <span>Core Phishing Delivery Tactics Analyzed</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attackVectors.map((v, i) => (
            <div key={i} className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                    v.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                    v.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {v.severity}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white">{v.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{v.description}</p>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Example</span>
                  <p className="text-xs font-mono text-rose-400 break-all">{v.example}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-cyber-border text-[11px] text-slate-400">
                <strong className="text-cyan-400 block mb-0.5">Defensive Rule:</strong>
                {v.countermeasure}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* College Viva Q&A Section */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">College Viva Voce Preparation Guide</h2>
        </div>
        <p className="text-xs text-slate-400">
          Frequently asked viva questions by academic project examiners regarding the machine learning model, tech stack, and cybersecurity architecture.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {vivaQuestions.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-cyber-card border border-cyber-border space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="text-cyan-400 font-mono font-bold text-xs mt-0.5">Q{idx + 1}:</span>
                <h3 className="text-xs font-bold text-white leading-relaxed">{item.q}</h3>
              </div>
              <p className="text-xs text-slate-400 pl-6 leading-relaxed border-l-2 border-cyan-500/30">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreatIntelPage;
