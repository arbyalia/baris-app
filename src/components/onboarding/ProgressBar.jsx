import React from 'react';

export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-label font-medium text-navy">
          Pertanyaan {current} dari {total}
        </span>
        <span className="text-micro text-ink3 font-medium">{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
        <div
          className="h-full bg-brand rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
