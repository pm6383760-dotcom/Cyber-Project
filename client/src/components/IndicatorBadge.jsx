import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

const IndicatorBadge = ({ indicator }) => {
  const { name, severity, description, weight } = indicator;

  let borderColor = 'border-slate-800';
  let badgeColor = 'bg-slate-800/80 text-slate-300';
  let icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;

  if (severity === 'high') {
    borderColor = 'border-rose-500/40 bg-rose-950/20';
    badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    icon = <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />;
  } else if (severity === 'medium') {
    borderColor = 'border-amber-500/40 bg-amber-950/20';
    badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    icon = <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />;
  } else {
    borderColor = 'border-emerald-500/30 bg-emerald-950/15';
    badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  }

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${borderColor} transition-all duration-200 hover:border-slate-600`}>
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
          <span className="font-semibold text-sm text-slate-200">{name}</span>
          <div className="flex items-center gap-2">
            {weight > 0 && (
              <span className="text-xs font-mono text-slate-400">
                Weight: +{weight}
              </span>
            )}
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}>
              {severity || 'info'}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default IndicatorBadge;
