import React from 'react';
import { ShieldAlert, Cpu } from 'lucide-react';

const ScanRadar = ({ currentStep }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-cyber-card/60 backdrop-blur-md border border-cyan-500/30 rounded-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* Cyber Radar Display */}
      <div className="relative w-48 h-48 rounded-full border border-cyan-500/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
        {/* Radar Rings */}
        <div className="absolute w-36 h-36 rounded-full border border-cyan-500/25" />
        <div className="absolute w-24 h-24 rounded-full border border-cyan-500/20" />
        <div className="absolute w-12 h-12 rounded-full border border-cyan-500/20" />

        {/* Crosshairs */}
        <div className="absolute w-full h-[1px] bg-cyan-500/20" />
        <div className="absolute h-full w-[1px] bg-cyan-500/20" />

        {/* Radar Sweep Ray */}
        <div 
          className="absolute inset-0 rounded-full animate-radar origin-center pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg, rgba(0, 240, 255, 0.45) 0deg, rgba(0, 240, 255, 0.05) 45deg, transparent 90deg)'
          }}
        />

        {/* Center Target Icon */}
        <div className="relative z-10 w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-400 animate-pulse">
          <Cpu className="w-5 h-5" />
        </div>
      </div>

      <div className="text-center z-10">
        <h4 className="text-lg font-bold text-white flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
          Analyzing URL Threat Signatures...
        </h4>
        <p className="text-sm font-mono text-cyan-300/80 mt-2 min-h-[1.5rem]">
          {currentStep || 'Extracting Lexical and Structural Vectors...'}
        </p>
      </div>
    </div>
  );
};

export default ScanRadar;
