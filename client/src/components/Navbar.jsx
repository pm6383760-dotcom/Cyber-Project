import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, User, LogOut, Sparkles, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { systemApi } from '../api/api';

const Navbar = () => {
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();
  const location = useLocation();
  const [systemOnline, setSystemOnline] = useState(true);

  useEffect(() => {
    const checkSystem = async () => {
      try {
        const res = await systemApi.getHealth();
        setSystemOnline(res.data?.status === 'ONLINE');
      } catch (e) {
        setSystemOnline(false);
      }
    };
    checkSystem();
    const interval = setInterval(checkSystem, 30000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: 'Scanner', path: '/dashboard' },
    { label: 'History', path: '/history' },
    { label: 'Analytics', path: '/analytics' },
    { label: 'Threat Intel', path: '/threat-intel' }
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-cyber-border bg-cyber-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
                <div className="w-full h-full bg-cyber-card rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-wider text-white flex items-center gap-1.5">
                  PHISHGUARD <span className="text-cyan-400 font-mono">AI</span>
                </span>
                <span className="text-[10px] uppercase font-mono text-slate-400 tracking-widest">
                  CYBER DEFENSE SYSTEM
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section: System Status & User Profile */}
          <div className="flex items-center gap-4">
            {/* System Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span>{systemOnline ? 'ML ENGINE READY' : 'OFFLINE MODE'}</span>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/settings"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/70 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-400 text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-200 hidden sm:inline max-w-[100px] truncate">
                    {user?.name || 'Analyst'}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-500/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={loginAsDemo}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold transition-all"
                  title="1-Click Login for College Viva Demo"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demo Login</span>
                </button>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
