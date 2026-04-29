import React, { useEffect } from 'react';

const C = {
  navy:       '#1A3A6B',
  brand:      '#2563EB',
  canvas:     '#F0F5FF',
  surface2:   '#E8F0FD',
  line:       '#E2E8F0',
  ink:        '#0F172A',
  ink2:       '#475569',
  ink3:       '#94A3B8',
  successBg:  '#DCFCE7', successText: '#16A34A', successBar: '#22C55E',
  warningBg:  '#FEF9C3', warningText: '#CA8A04', warningBar: '#F59E0B',
  dangerBg:   '#FEE2E2', dangerText:  '#DC2626', dangerBar:  '#EF4444',
};

const AGE_LABEL = {
  under_1y: 'Kurang dari 1 tahun', '1y_2y': '1–2 tahun',
  '3y_5y': '3–5 tahun', over_5y: 'Lebih dari 5 tahun',
};
const EMP_LABEL = {
  '1': 'Hanya saya sendiri', '1_3': '1–3 orang',
  '4_10': '4–10 orang', over_10: 'Lebih dari 10 orang',
};
const PLATFORM_LABEL = {
  shopee: 'Shopee', tokopedia: 'Tokopedia', instagram: 'Instagram',
  whatsapp: 'WhatsApp', toko_fisik: 'Toko Fisik', facebook: 'Facebook',
  tiktok: 'TikTok Shop', lainnya: 'Lainnya',
};
const CATEGORY_LABEL = {
  kuliner: 'Kuliner & Makanan', fashion: 'Fashion & Pakaian',
  kerajinan: 'Kerajinan Tangan', kecantikan: 'Kecantikan & Perawatan',
  pertanian: 'Pertanian & Pangan', perdagangan: 'Perdagangan Umum',
  jasa: 'Jasa & Layanan', lainnya: 'Lainnya',
};
const RATING_LABEL = { A: 'Sangat Layak', B: 'Layak', C: 'Cukup Layak', D: 'Perlu Peningkatan', E: 'Belum Layak' };
const DIMENSIONS = [
  { key: 'reputasiDigital',        name: 'Reputasi Digital',        weight: '30%' },
  { key: 'konsistensiOperasional', name: 'Konsistensi Operasional', weight: '25%' },
  { key: 'kematanganBisnis',       name: 'Kematangan Bisnis',       weight: '25%' },
  { key: 'profilRisiko',           name: 'Profil Risiko',           weight: '20%' },
];

function scoreColor(score) {
  if (score >= 70) return { text: C.successText, bar: C.successBar, bg: C.successBg };
  if (score >= 40) return { text: C.warningText, bar: C.warningBar, bg: C.warningBg };
  return { text: C.dangerText, bar: C.dangerBar, bg: C.dangerBg };
}
function ratingConfig(rating) {
  if (rating === 'A' || rating === 'B') return { bg: C.successBg, text: C.successText, progress: C.successBar };
  if (rating === 'C') return { bg: C.warningBg, text: C.warningText, progress: C.warningBar };
  return { bg: C.dangerBg, text: C.dangerText, progress: C.dangerBar };
}
function formatDate(d) {
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function SectionTitle({ text }) {
  return (
    <div style={{ borderBottom: `2px solid ${C.navy}`, paddingBottom: 6, marginBottom: 10 }}>
      <p style={{ margin: 0, fontWeight: '700', fontSize: 11, color: C.navy, textTransform: 'uppercase', letterSpacing: 2 }}>
        {text}
      </p>
    </div>
  );
}

export default function PDFTemplate({ data, onReady }) {
  const {
    answers = {}, scores = {}, totalScore = 0,
    rating = 'E', confidenceScore = 60,
    recommendations = [], lenders = [],
  } = data;

  useEffect(() => { if (onReady) onReady(); }, []); // eslint-disable-line

  const now = new Date();
  const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const refNum = `BARIS-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(Math.floor(10000 + Math.random() * 90000))}`;
  const platforms = Array.isArray(answers.onlinePlatforms)
    ? answers.onlinePlatforms.map(p => PLATFORM_LABEL[p] || p).join(', ')
    : '-';

  const rc = ratingConfig(rating);
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (totalScore / 100) * circ;

  const base = { fontFamily: 'Arial, Helvetica, sans-serif', width: 794, backgroundColor: '#ffffff', color: C.ink };

  return (
    <div style={base}>

      <div style={{ backgroundColor: C.navy, padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 26, fontWeight: '700', letterSpacing: 3 }}>BARIS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 2 }}>
            <div style={{ width: 18, height: 3, backgroundColor: '#fff', borderRadius: 2 }} />
            <div style={{ width: 13, height: 3, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 2 }} />
            <div style={{ width: 9, height: 3, backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: '700' }}>{refNum}</p>
          <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>Diterbitkan: {formatDate(now)}</p>
          <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>Bisnis Alternatif Risk Intelligent Scoring</p>
        </div>
      </div>

      <div style={{ padding: '20px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div>
          <SectionTitle text="Profil Usaha" />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            {[
              ['Nama Usaha',      answers.businessName || '-'],
              ['Kategori',        CATEGORY_LABEL[answers.category] || '-'],
              ['Lama Berdiri',    AGE_LABEL[answers.businessAge] || '-'],
              ['Platform Jualan', platforms || '-'],
              ['Jumlah Karyawan', EMP_LABEL[answers.employees] || '-'],
            ].map(([label, value], idx) => (
              <tr key={label} style={{ backgroundColor: idx % 2 === 0 ? C.canvas : '#fff' }}>
                <td style={{ padding: '6px 12px', fontWeight: '700', width: 180, color: C.ink3, fontSize: 11, borderBottom: `1px solid ${C.line}` }}>{label}</td>
                <td style={{ padding: '6px 12px', color: C.ink, fontSize: 12, borderBottom: `1px solid ${C.line}` }}>{value}</td>
              </tr>
            ))}
          </table>
        </div>

        <div>
          <SectionTitle text="Hasil Penilaian Kredit Alternatif" />
          <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r={radius} fill="none"
                  stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                <circle cx="50" cy="50" r={radius} fill="none"
                  stroke={rc.progress} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={offset} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 26, fontWeight: '700', lineHeight: 1 }}>{totalScore}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 }}>/ 100</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ backgroundColor: rc.bg, color: rc.text, padding: '3px 12px', borderRadius: 999, fontSize: 12, fontWeight: '700' }}>
                  Rating {rating}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' }}>{RATING_LABEL[rating]}</span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                Skor kelayakan kredit alternatif berbasis data digital usaha Anda, dianalisis menggunakan teknologi Azure AI Language.
              </p>
              <span style={{ backgroundColor: C.surface2, color: C.brand, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: '700' }}>
                Kepercayaan AI: {confidenceScore}%
              </span>
            </div>
          </div>
        </div>

        <div>
          <SectionTitle text="Rincian Per Dimensi" />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ backgroundColor: C.navy }}>
                {['Dimensi', 'Skor', 'Visual', 'Bobot'].map(h => (
                  <th key={h} style={{ padding: '7px 12px', color: '#fff', textAlign: 'left', fontWeight: '700', fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DIMENSIONS.map((d, i) => {
                const sc = scores[d.key] || 0;
                const col = scoreColor(sc);
                return (
                  <tr key={d.key} style={{ backgroundColor: i % 2 === 0 ? C.canvas : '#fff' }}>
                    <td style={{ padding: '7px 12px', fontWeight: '600', color: C.ink, borderBottom: `1px solid ${C.line}` }}>{d.name}</td>
                    <td style={{ padding: '7px 12px', fontWeight: '700', color: col.text, borderBottom: `1px solid ${C.line}` }}>{sc}</td>
                    <td style={{ padding: '7px 12px', width: 180, borderBottom: `1px solid ${C.line}` }}>
                      <div style={{ height: 8, backgroundColor: C.line, borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${sc}%`, backgroundColor: col.bar, borderRadius: 4 }} />
                      </div>
                    </td>
                    <td style={{ padding: '7px 12px', color: C.ink3, borderBottom: `1px solid ${C.line}` }}>{d.weight}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div>
          <SectionTitle text="Rekomendasi Peningkatan" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {recommendations.map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', backgroundColor: C.canvas, borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ minWidth: 20, height: 20, backgroundColor: C.brand, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{i + 1}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: C.ink }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle text="Rekomendasi Lembaga Pembiayaan" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {lenders.map((lender, i) => (
              <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: '10px 14px', backgroundColor: C.canvas }}>
                <p style={{ margin: 0, fontWeight: '700', fontSize: 12, color: C.navy }}>{lender.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: 11, color: C.ink2, lineHeight: 1.4 }}>{lender.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={{ borderTop: `2px solid ${C.navy}`, padding: '12px 32px', backgroundColor: C.canvas }}>
        <p style={{ margin: 0, fontSize: 10, color: C.ink3, textAlign: 'center' }}>
          Laporan dihasilkan oleh BARIS · Azure AI Language · Bukan jaminan persetujuan kredit
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 10, color: C.ink3, textAlign: 'center' }}>
          Berlaku 30 hari · Kedaluwarsa: {formatDate(expiry)}
        </p>
      </div>

    </div>
  );
}
