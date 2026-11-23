import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldCheck, 
  History, 
  BarChart3, 
  BookOpen, 
  Settings, 
  ExternalLink,
  Cpu,
  Lock
} from 'lucide-react';
import { useScan } from '../context/ScanContext';

const Sidebar = () => {
  const { history, analytics } = useScan();

  const links = [
    { to: '/dashboard', label: 'URL Threat Scanner', icon: ShieldCheck, badge: null },
    { to: '/history', label: 'Audit History', icon: History, badge: history?.length || 0 },
    { to: '/analytics', label: 'Threat Analytics', icon: BarChart3, badge: null },
    { to: '/threat-intel', label: 'Phishing Vectors', icon: BookOpen, badge: 'VIVA' },
    { to: '/settings', label: 'System & Engine', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 bg-cyber-darker border-r border-cyber-border min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden lg:flex">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-2">
            Cyber Threat Operations
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== null && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Quick Threat Metrics Widget in Sidebar */}
        <div className="p-3.5 rounded-2xl bg-cyber-card border border-cyber-border space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white tracking-wide">Threat Radar Active</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Total Scans Logged</span>
              <span className="font-mono text-cyan-300 font-bold">{analytics?.totalScans || 0}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Phishing Flagged</span>
              <span className="font-mono text-rose-400 font-bold">{analytics?.phishingCount || 0}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Average Threat Risk</span>
              <span className="font-mono text-amber-400 font-bold">{analytics?.avgRiskScore || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* College Project Viva Metadata Footer */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">PhishGuard AI v1.0.0</p>
        <p className="text-[10px] text-slate-500">B.Tech CS Capstone Project</p>
        <p className="text-[10px] text-cyan-400 font-mono">Random Forest ML + MERN</p>
      </div>
    </aside>
  );
};

export default Sidebar;
