import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Download, 
  ExternalLink, 
  Eye, 
  ShieldAlert, 
  ShieldCheck, 
  Filter,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import ExportReportModal from '../components/ExportReportModal';

const HistoryPage = () => {
  const { history, loadingHistory, fetchHistory, deleteScan, clearHistory, setCurrentScan } = useScan();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedScanForModal, setSelectedScanForModal] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = history.filter(scan => {
    const matchesRisk = riskFilter === 'ALL' || scan.riskLevel === riskFilter;
    const matchesSearch = 
      (scan.url || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scan.domain || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const handleExportCsv = () => {
    let csv = 'ID,URL,Domain,Prediction,Risk_Score,Risk_Level,Confidence,Engine,Date\n';
    filteredHistory.forEach(s => {
      const cleanUrl = (s.url || '').replace(/"/g, '""');
      const cleanDomain = (s.domain || '').replace(/"/g, '""');
      csv += `"${s._id || s.id}","${cleanUrl}","${cleanDomain}","${s.prediction}",${s.riskScore},"${s.riskLevel}",${s.confidence}%,"${s.engineUsed}","${new Date(s.createdAt).toISOString()}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `PhishGuard-Scan-Audit-${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyber-border">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
            SECURITY LOGS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            URL Threat Scan History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Archived cybersecurity analysis records with cryptographic fingerprints
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={filteredHistory.length === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={history.length === 0}
            className="px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-cyber-card border border-cyber-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domain or URL keywords..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 font-mono transition-colors"
          />
        </div>

        {/* Risk Filter Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-2 font-medium">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Filter:
          </span>
          {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((level) => (
            <button
              key={level}
              onClick={() => setRiskFilter(level)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                riskFilter === level
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Scans Table */}
      <div className="rounded-2xl bg-cyber-card border border-cyber-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-cyber-border text-slate-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Scanned URL & Host</th>
                <th className="py-3.5 px-4">Threat Score</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Date Recorded</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((scan) => {
                  const isPhishing = scan.prediction === 'PHISHING';
                  const isSuspicious = scan.prediction === 'SUSPICIOUS';

                  return (
                    <tr key={scan._id || scan.id} className="hover:bg-slate-900/40 transition-colors">
                      {/* Classification Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border ${
                          isPhishing
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : isSuspicious
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {isPhishing ? (
                            <ShieldAlert className="w-3.5 h-3.5" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          )}
                          <span>{scan.prediction}</span>
                        </span>
                      </td>

                      {/* URL & Domain */}
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <p className="font-mono text-cyan-300 truncate">{scan.url}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate font-mono">
                          {scan.domain || 'Direct Host'}
                        </p>
                      </td>

                      {/* Threat Score */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold">
                        <span className={
                          scan.riskScore >= 60 ? 'text-rose-400' :
                          scan.riskScore >= 35 ? 'text-amber-400' : 'text-emerald-400'
                        }>
                          {scan.riskScore} / 100
                        </span>
                      </td>

                      {/* Confidence */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-300">
                        {scan.confidence}%
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {new Date(scan.createdAt).toLocaleDateString()} {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => setSelectedScanForModal(scan)}
                          title="Generate PDF Report"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors inline-flex items-center"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteScan(scan._id || scan.id)}
                          title="Delete Record"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors inline-flex items-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 text-sm">
                    No scan records matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-cyber-card border border-rose-500/40 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Clear All Scan Records?</h3>
            <p className="text-xs text-slate-400">
              This action will permanently delete all logged scans from your local audit history.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Export Modal */}
      {selectedScanForModal && (
        <ExportReportModal
          scan={selectedScanForModal}
          onClose={() => setSelectedScanForModal(null)}
        />
      )}
    </div>
  );
};

export default HistoryPage;
