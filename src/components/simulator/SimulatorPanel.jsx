import React, { useState, useMemo } from 'react';
import { useBaris } from '../../context/BarisContext';
import { simulateScore } from '../../utils/scoringEngine';

const DAYS_DEFAULT = { '1_3d': 2, '4_5d': 5, '6d': 6, '7d': 7 };
const DIVERSITY_OPTIONS = [
  { key: 'single', label: 'Hanya 1' },
  { key: '2_5',   label: '2–5 jenis' },
  { key: 'over_5', label: '>5 jenis' },
];

function SliderRow({ label, min, max, value, onChange, displayValue }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-label font-medium text-ink">{label}</span>
        <span className="text-label font-semibold text-brand min-w-[70px] text-right">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        className="baris-slider"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-micro text-ink3">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default function SimulatorPanel({ originalScore }) {
  const { answers, sentimentResults } = useBaris();

  const defaultDays      = DAYS_DEFAULT[answers.operationalDays] ?? 5;
  const defaultPlatforms = Math.max(1, Math.min(6, Array.isArray(answers.onlinePlatforms) ? answers.onlinePlatforms.length : 1));
  const defaultDiversity = answers.productDiversity || 'single';

  const [isExpanded, setIsExpanded]       = useState(false);
  const [extraReviews, setExtraReviews]   = useState(0);
  const [simDays, setSimDays]             = useState(defaultDays);
  const [simPlatforms, setSimPlatforms]   = useState(defaultPlatforms);
  const [simDiversityKey, setSimDiversity]= useState(defaultDiversity);

  const handleReset = () => {
    setExtraReviews(0);
    setSimDays(defaultDays);
    setSimPlatforms(defaultPlatforms);
    setSimDiversity(defaultDiversity);
  };

  const simResult = useMemo(() => simulateScore(
    answers, sentimentResults,
    { extraReviews, simDays, simPlatforms, simDiversityKey }
  ), [answers, sentimentResults, extraReviews, simDays, simPlatforms, simDiversityKey]);

  const delta = simResult.totalScore - originalScore;
  const deltaLabel =
    delta > 0  ? `+${delta} poin` :
    delta < 0  ? `${delta} poin` :
                 'Tidak berubah';
  const deltaColor =
    delta > 0  ? 'text-success' :
    delta < 0  ? 'text-danger'  :
                 'text-ink3';

  return (
    <div className="bg-surface border border-line rounded-2xl overflow-hidden mb-5">
      {/* Header — toggle */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-canvas transition-colors"
        onClick={() => setIsExpanded((v) => !v)}
        aria-expanded={isExpanded}
      >
        <div className="text-left">
          <p className="text-label font-semibold text-navy">💡 Simulasi: Bagaimana Jika?</p>
          <p className="text-micro text-ink3 mt-0.5">Eksplorasi potensi kenaikan skor Anda</p>
        </div>
        <svg
          className={`w-5 h-5 text-ink2 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable content */}
      <div
        style={{
          maxHeight: isExpanded ? '800px' : '0',
          transition: 'max-height 0.35s ease',
          overflow: 'hidden',
        }}
      >
        <div className="px-5 pb-5 flex flex-col gap-5">
          {/* Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-canvas border border-line rounded-2xl p-3 text-center">
              <p className="text-micro text-ink3 mb-1">Skor Saat Ini</p>
              <p className="font-bold text-ink leading-none" style={{ fontSize: '2.25rem' }}>
                {originalScore}
              </p>
            </div>
            <div className="bg-surface2 border border-brand/20 rounded-2xl p-3 text-center">
              <p className="text-micro text-brand font-medium mb-1">Potensi Skor</p>
              <p className="font-bold text-brand leading-none" style={{ fontSize: '2.25rem' }}>
                {simResult.totalScore}
              </p>
              <p className={`text-micro font-semibold mt-1 ${deltaColor}`}>{deltaLabel}</p>
            </div>
          </div>

          <hr className="border-line" />

          <SliderRow
            label="Tambah ulasan positif pelanggan"
            min={0} max={50}
            value={extraReviews}
            onChange={setExtraReviews}
            displayValue={extraReviews === 0 ? 'Tidak ada' : `+${extraReviews} ulasan`}
          />

          <SliderRow
            label="Hari operasional per minggu"
            min={1} max={7}
            value={simDays}
            onChange={setSimDays}
            displayValue={`${simDays} hari`}
          />

          <SliderRow
            label="Jumlah platform jualan online aktif"
            min={1} max={6}
            value={simPlatforms}
            onChange={setSimPlatforms}
            displayValue={`${simPlatforms} platform`}
          />

          {/* Diversifikasi produk */}
          <div className="flex flex-col gap-2">
            <span className="text-label font-medium text-ink">Jumlah jenis produk/layanan</span>
            <div className="grid grid-cols-3 gap-2">
              {DIVERSITY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSimDiversity(opt.key)}
                  className={`py-2 px-1 rounded-xl text-label font-semibold border transition-all
                    ${simDiversityKey === opt.key
                      ? 'border-brand bg-surface2 text-brand'
                      : 'border-line text-ink2 hover:border-sky hover:bg-canvas'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2.5 rounded-xl border border-line text-label font-semibold
              text-ink2 hover:bg-canvas hover:border-ink2 transition-colors"
          >
            ↺ Reset ke Nilai Awal
          </button>
        </div>
      </div>
    </div>
  );
}
