import React from 'react';

const RiskGauge = ({ score = 0, level = 'LOW', size = 180 }) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Semicircle arc (180 degrees)
  const arcLength = circumference * 0.75;
  const offset = arcLength - (score / 100) * arcLength;

  let color = '#10B981'; // Green
  let glowClass = 'glow-green';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  if (score >= 60 || level === 'HIGH') {
    color = '#EF4444'; // Red
    glowClass = 'glow-red';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (score >= 35 || level === 'MEDIUM') {
    color = '#F59E0B'; // Amber
    glowClass = '';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-135">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Value Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black font-mono tracking-tight" style={{ color }}>
            {score}
          </span>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
            Threat Score / 100
          </span>
        </div>
      </div>

      <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeBg}`}>
        {level} RISK LEVEL
      </div>
    </div>
  );
};

export default RiskGauge;
