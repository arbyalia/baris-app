import React, { useEffect, useState } from 'react';

const RATING_CONFIG = {
  A: { label: 'Sangat Layak',      textColor: '#16A34A', bgColor: '#DCFCE7', progress: '#22C55E' },
  B: { label: 'Layak',             textColor: '#16A34A', bgColor: '#DCFCE7', progress: '#22C55E' },
  C: { label: 'Cukup Layak',       textColor: '#CA8A04', bgColor: '#FEF9C3', progress: '#F59E0B' },
  D: { label: 'Perlu Peningkatan', textColor: '#DC2626', bgColor: '#FEE2E2', progress: '#EF4444' },
  E: { label: 'Belum Layak',       textColor: '#DC2626', bgColor: '#FEE2E2', progress: '#EF4444' },
};

export default function ScoreDisplay({ score, rating, businessName, confidence }) {
  const [displayScore, setDisplayScore] = useState(0);
  const config = RATING_CONFIG[rating] || RATING_CONFIG['C'];

  useEffect(() => {
    let start = 0;
    const step = 16;
    const increment = score / (1200 / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) { setDisplayScore(score); clearInterval(timer); }
      else { setDisplayScore(Math.round(start)); }
    }, step);
    return () => clearInterval(timer);
  }, [score]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="bg-navy rounded-3xl p-8 text-center">
      <p className="text-micro text-white/50 uppercase tracking-widest mb-1">
        Skor Kelayakan Kredit
      </p>
      <p className="text-small text-white/70 font-medium mb-6">{businessName || 'Usaha Anda'}</p>

      <div className="relative w-36 h-36 mx-auto mb-6">
        <svg viewBox="0 0 120 120" width="144" height="144" className="-rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none"
            stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <circle cx="60" cy="60" r={radius} fill="none"
            stroke={config.progress} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={progressOffset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-bold text-white leading-none"
            style={{ fontSize: '2.75rem', fontFamily: 'Poppins, sans-serif' }}>
            {displayScore}
          </span>
          <span className="text-white/50 font-medium mt-0.5" style={{ fontSize: '13px' }}>
            / 100
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <span className="px-3 py-1 rounded-full text-label font-semibold"
          style={{ backgroundColor: config.bgColor, color: config.textColor }}>
          Rating {rating}
        </span>
        <span className="text-white/70 text-small">{config.label}</span>
      </div>

      {confidence !== undefined && (
        <p className="text-white/40 text-micro uppercase tracking-wider mt-4">
          Kepercayaan AI: {confidence}%
        </p>
      )}
    </div>
  );
}
