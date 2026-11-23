import React, { useEffect } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  ShieldAlert, 
  ShieldCheck, 
  BarChart3, 
  Activity, 
  TrendingUp, 
  Cpu, 
  AlertTriangle 
} from 'lucide-react';
import { useScan } from '../context/ScanContext';

const AnalyticsPage = () => {
  const { analytics, fetchAnalytics } = useScan();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const total = analytics?.totalScans || 0;
  const phishing = analytics?.phishingCount || 0;
  const legit = analytics?.legitimateCount || 0;
  const suspicious = analytics?.suspiciousCount || 0;
  const avgRisk = analytics?.avgRiskScore || 0;

  const pieData = [
    { name: 'Phishing', value: phishing, color: '#EF4444' },
    { name: 'Legitimate', value: legit, color: '#10B981' },
    { name: 'Suspicious', value: suspicious, color: '#F59E0B' }
  ].filter(d => d.value > 0);

  const riskLevelData = [
    { name: 'Low Risk', count: analytics?.lowRiskCount || 0, fill: '#10B981' },
    { name: 'Medium Risk', count: analytics?.mediumRiskCount || 0, fill: '#F59E0B' },
    { name: 'High Risk', count: analytics?.highRiskCount || 0, fill: '#EF4444' }
  ];

  const topIndicatorsData = (analytics?.topIndicators || []).map(ind => ({
    name: ind.name.length > 20 ? ind.name.substring(0, 18) + '...' : ind.name,
    count: ind.count
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-6 border-b border-cyber-border">
        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
          INTELLIGENCE DASHBOARD
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
          Cyber Threat Analytics & Metrics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Aggregated detection distribution, ML classification ratios, and common attack vectors
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Scans</span>
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">{total}</div>
          <p className="text-[11px] text-slate-500 font-mono">Analyzed URL instances</p>
        </div>

        <div className="p-5 rounded-2xl bg-cyber-card border border-rose-500/30 bg-rose-950/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-300 font-medium uppercase tracking-wider">Phishing Flagged</span>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-400">{phishing}</div>
          <p className="text-[11px] text-rose-300/60 font-mono">
            {total > 0 ? ((phishing / total) * 100).toFixed(1) : 0}% of total volume
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-cyber-card border border-emerald-500/30 bg-emerald-950/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-medium uppercase tracking-wider">Legitimate URLs</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">{legit}</div>
          <p className="text-[11px] text-emerald-300/60 font-mono">
            {total > 0 ? ((legit / total) * 100).toFixed(1) : 0}% verified safe
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Average Threat Score</span>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-400">{avgRisk} / 100</div>
          <p className="text-[11px] text-slate-500 font-mono">Fleet risk baseline</p>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Classification Ratio Pie Chart */}
        <div className="p-6 rounded-3xl bg-cyber-card border border-cyber-border shadow-xl space-y-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Verdict Classification Ratio</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Phishing vs Legitimate vs Suspicious URL proportions
            </p>
          </div>

          <div className="h-64 flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '12px', fontSize: '12px', color: '#F1F5F9' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500 font-mono">No analytics scans recorded yet.</p>
            )}
          </div>
        </div>

        {/* Risk Level Distribution Bar Chart */}
        <div className="p-6 rounded-3xl bg-cyber-card border border-cyber-border shadow-xl space-y-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-cyan-400" />
              <span>Risk Tier Distribution</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Number of scans classified into Low, Medium, and High threat tiers
            </p>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskLevelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {riskLevelData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Indicators Bar Chart */}
      <div className="p-6 rounded-3xl bg-cyber-card border border-cyber-border shadow-xl space-y-4">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Most Frequently Detected Threat Indicators</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Top lexical signatures triggering risk penalties across scanned URLs
          </p>
        </div>

        <div className="h-64">
          {topIndicatorsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topIndicatorsData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <XAxis type="number" stroke="#64748B" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#00F0FF" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
              Insufficient indicator data. Scan more URLs to visualize common patterns.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
