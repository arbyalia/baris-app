import React from 'react';

export default function RecommendationList({ recommendations, lenders }) {
  return (
    <div className="flex flex-col gap-8">
      {/* Rekomendasi tindakan */}
      <section>
        <p className="text-micro text-ink3 uppercase tracking-widest mb-4">Langkah meningkatkan skor</p>
        <div className="flex flex-col gap-3">
          {recommendations.map((rec, i) => (
            <div key={i} className="bg-surface border border-line rounded-xl px-5 py-4 flex items-start gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-surface2 text-brand
                text-label font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-small text-ink leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lembaga pembiayaan */}
      <section>
        <p className="text-micro text-ink3 uppercase tracking-widest mb-1">Rekomendasi lembaga pembiayaan</p>
        <p className="text-small text-ink2 mb-4">Pilihan yang sesuai dengan profil dan rating usaha Anda</p>
        <div className="flex flex-col gap-3">
          {lenders.map((lender, i) => (
            <div key={i} className="bg-surface border border-line rounded-xl px-5 py-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-200">
              <div className="flex-1">
                <p className="text-label font-semibold text-ink">{lender.name}</p>
                <p className="text-micro text-ink2 mt-0.5">{lender.desc}</p>
              </div>
              {lender.url && lender.url !== '#' ? (
                <a
                  href={lender.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-label font-semibold text-brand border border-brand
                    px-4 py-2 rounded-full hover:bg-surface2 transition-colors"
                >
                  Pelajari
                </a>
              ) : (
                <span className="flex-shrink-0 text-label text-ink3 border border-line px-4 py-2 rounded-full">
                  Cari lokal
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
