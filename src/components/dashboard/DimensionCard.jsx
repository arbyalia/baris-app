import React from 'react';

function getBarColor(score) {
  if (score >= 70) return '#22C55E';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
}
function getTextColor(score) {
  if (score >= 70) return 'text-success';
  if (score >= 40) return 'text-warning';
  return 'text-danger';
}

export default function DimensionCard({ icon, name, score, description }) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-200">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="text-label font-semibold text-ink leading-tight">{name}</span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`font-bold leading-none ${getTextColor(score)}`}
          style={{ fontSize: '2.25rem' }}>
          {score}
        </span>
        <span className="text-micro text-ink3">/100</span>
      </div>

      <div className="w-full bg-surface2 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-1.5 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${score}%`, backgroundColor: getBarColor(score) }}
        />
      </div>

      <p className="text-micro text-ink2 leading-relaxed">{description}</p>
    </div>
  );
}
