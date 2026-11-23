import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp, Info } from 'lucide-react';

const FeatureBreakdown = ({ features = {} }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!features || Object.keys(features).length === 0) return null;

  const featureItems = [
    { label: 'URL Length', value: features.url_length ?? 'N/A', alert: features.url_length > 75, desc: 'Total characters in full link' },
    { label: 'Shannon Entropy', value: features.shannon_entropy ?? 'N/A', alert: features.shannon_entropy > 4.4, desc: 'Algorithmic randomness metric' },
    { label: 'IP in Hostname', value: features.has_ip ? 'YES (Detected)' : 'NO', alert: features.has_ip === 1, desc: 'Direct IP bypasses domain registry' },
    { label: 'High-Risk TLD', value: features.suspicious_tld ? 'YES (Flagged)' : 'NO (Standard)', alert: features.suspicious_tld === 1, desc: 'Known spam/abuse extension' },
    { label: 'Credential Keywords', value: features.sensitive_keywords_count ?? 0, alert: features.sensitive_keywords_count > 0, desc: 'Login, verify, bank, wallet terms' },
    { label: 'Subdomains Count', value: features.subdomains_count ?? 0, alert: features.subdomains_count >= 3, desc: 'Excessive subdomains mimic real domains' },
    { label: 'Domain Hyphens', value: features.has_prefix_suffix ? 'Present' : 'None', alert: features.has_prefix_suffix === 1, desc: 'Prefix-suffix typo imitation' },
    { label: 'Encrypted (HTTPS)', value: features.is_https ? 'HTTPS (Active)' : 'HTTP (Insecure)', alert: features.is_https === 0, desc: 'SSL/TLS transport security' },
    { label: '@ Redirection', value: features.count_at > 0 ? 'Present' : 'None', alert: features.count_at > 0, desc: 'Deceptive user credentials delimiter' },
    { label: 'Digits Ratio', value: features.digits_ratio ? `${(features.digits_ratio * 100).toFixed(1)}%` : '0%', alert: features.digits_ratio > 0.3, desc: 'Ratio of numbers to URL characters' },
    { label: 'URL Shortener', value: features.is_shortened ? 'YES (Masked)' : 'NO', alert: features.is_shortened === 1, desc: 'Link redirect obfuscation' },
    { label: 'Path Redirection (//)', value: features.has_double_slash ? 'Detected' : 'None', alert: features.has_double_slash === 1, desc: 'Open-redirect parameter risk' }
  ];

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-2xl overflow-hidden mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">
            Machine Learning Feature Extraction Vector (22 Features)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{isOpen ? 'Collapse' : 'Inspect Features'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-cyber-card">
          {featureItems.map((f, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border ${
                f.alert 
                  ? 'border-rose-500/30 bg-rose-950/15' 
                  : 'border-slate-800 bg-slate-900/40'
              } flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 font-medium">{f.label}</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    f.alert
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {f.value}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureBreakdown;
