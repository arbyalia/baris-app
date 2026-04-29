import React, { useState } from 'react';

function getStyle(score) {
  if (score > 80) return 'bg-success-bg text-success';
  if (score >= 60) return 'bg-warning-bg text-warning';
  return 'bg-surface2 text-ink3';
}

export default function ConfidenceBadge({ score }) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setShowTip((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-label font-semibold
          transition-colors ${getStyle(score)}`}
        aria-label="Lihat penjelasan AI Confidence Score"
      >
        <span>Kepercayaan AI: {score}%</span>
        <span className="opacity-60 text-micro">ⓘ</span>
      </button>

      {showTip && (
        <div className="absolute top-full mt-2 left-0 z-10 w-64 bg-surface border border-line
          rounded-xl shadow-sm p-4 text-small text-ink2 leading-relaxed">
          <p className="font-semibold text-ink mb-2">Apa itu Kepercayaan AI?</p>
          <p>
            Skor ini mencerminkan seberapa lengkap data yang Anda berikan.
            Semakin banyak ulasan dan pertanyaan yang dijawab, semakin akurat hasilnya.
          </p>
          <button onClick={() => setShowTip(false)} className="mt-3 text-brand text-label font-semibold hover:underline">
            Tutup
          </button>
        </div>
      )}
    </div>
  );
}
