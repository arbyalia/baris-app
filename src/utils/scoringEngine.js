// ─── Lookup tables ──────────────────────────────────────────────────────────

const PLATFORM_SCORE = (count) => {
  if (count >= 4) return 100;
  if (count === 3) return 75;
  if (count === 2) return 55;
  if (count === 1) return 30;
  return 10;
};

const DAY_SCORE     = { '1_3d': 40, '4_5d': 60, '6d': 80, '7d': 100 };
const UPDATE_SCORE  = { rarely: 25, sometimes: 50, weekly: 75, daily: 100 };
const AGE_SCORE     = { under_1y: 25, '1y_2y': 50, '3y_5y': 75, over_5y: 100 };
const EMP_SCORE     = { '1': 25, '1_3': 50, '4_10': 75, over_10: 100 };
const DIVERSITY_SCORE = { single: 30, '2_5': 65, over_5: 100 };

const avg = (...vals) => vals.reduce((s, v) => s + v, 0) / vals.length;


export function calculateScore(answers, sentimentResults) {
  const platforms = Array.isArray(answers.onlinePlatforms)
    ? answers.onlinePlatforms.length
    : 0;

  // D1: Reputasi Digital (30%)
  const avgPositive = sentimentResults.length > 0
    ? sentimentResults.reduce((s, r) => s + (r.confidenceScores?.positive ?? 0), 0) / sentimentResults.length
    : 0;
  const d1 = Math.round(avgPositive * 100);

  // D2: Konsistensi Operasional (25%)
  const dayScore    = DAY_SCORE[answers.operationalDays] ?? 40;
  const updateScore = UPDATE_SCORE[answers.updateFrequency] ?? 25;
  const platScore   = PLATFORM_SCORE(platforms);
  const d2 = Math.round(avg(dayScore, updateScore, platScore));

  // D3: Kematangan Bisnis (25%)
  const ageScore = AGE_SCORE[answers.businessAge] ?? 25;
  const empScore = EMP_SCORE[answers.employees] ?? 25;
  const catScore = answers.category === 'lainnya' ? 50 : 70;
  const d3 = Math.round(avg(ageScore, empScore, catScore));

  // D4: Profil Risiko (20%)
  const divScore  = DIVERSITY_SCORE[answers.productDiversity] ?? 30;
  const d4 = Math.round(avg(divScore, platScore));

  const totalScore = Math.round(d1 * 0.30 + d2 * 0.25 + d3 * 0.25 + d4 * 0.20);

  const rating =
    totalScore >= 85 ? 'A' :
    totalScore >= 70 ? 'B' :
    totalScore >= 55 ? 'C' :
    totalScore >= 40 ? 'D' : 'E';

  // AI Confidence Score
  let confidence = 60;
  if (sentimentResults.length >= 5) confidence += 10;
  if (sentimentResults.length >= 8) confidence += 10;
  if (Object.keys(answers).length >= 8) confidence += 10;
  if (platforms >= 2) confidence += 10;
  confidence = Math.min(confidence, 100);

  return {
    scores: { reputasiDigital: d1, konsistensiOperasional: d2, kematanganBisnis: d3, profilRisiko: d4 },
    totalScore,
    rating,
    confidenceScore: confidence,
  };
}


// Map slider days value (1-7) to day score
const daysToScore = (d) => d <= 3 ? 40 : d <= 5 ? 60 : d === 6 ? 80 : 100;

export function simulateScore(answers, sentimentResults, overrides = {}) {
  const {
    extraReviews = 0,
    simDays = null,       // number 1–7, null = pakai answers
    simPlatforms = null,  // number 1–6, null = pakai answers
    simDiversityKey = null, // 'single'|'2_5'|'over_5', null = pakai answers
  } = overrides;

  // D1: tambah ulasan positif (positive score = 1.0 per ulasan tambahan)
  const currentPositiveSum = sentimentResults.reduce(
    (s, r) => s + (r.confidenceScores?.positive ?? 0), 0
  );
  const totalReviews = sentimentResults.length + extraReviews;
  const newAvgPositive = totalReviews > 0
    ? (currentPositiveSum + extraReviews) / totalReviews
    : 0;
  const d1 = Math.round(newAvgPositive * 100);

  // Platform count
  const platforms = simPlatforms !== null
    ? simPlatforms
    : (Array.isArray(answers.onlinePlatforms) ? answers.onlinePlatforms.length : 0);
  const platScore = PLATFORM_SCORE(platforms);

  // D2: hari operasional bisa dioverride
  const dayScore = simDays !== null
    ? daysToScore(simDays)
    : (DAY_SCORE[answers.operationalDays] ?? 40);
  const updateScore = UPDATE_SCORE[answers.updateFrequency] ?? 25;
  const d2 = Math.round(avg(dayScore, updateScore, platScore));

  // D3: tidak dioverride
  const ageScore = AGE_SCORE[answers.businessAge] ?? 25;
  const empScore = EMP_SCORE[answers.employees] ?? 25;
  const catScore = answers.category === 'lainnya' ? 50 : 70;
  const d3 = Math.round(avg(ageScore, empScore, catScore));

  // D4: diversifikasi bisa dioverride
  const divKey = simDiversityKey ?? answers.productDiversity;
  const divScore = DIVERSITY_SCORE[divKey] ?? 30;
  const d4 = Math.round(avg(divScore, platScore));

  const totalScore = Math.round(d1 * 0.30 + d2 * 0.25 + d3 * 0.25 + d4 * 0.20);

  return {
    scores: { reputasiDigital: d1, konsistensiOperasional: d2, kematanganBisnis: d3, profilRisiko: d4 },
    totalScore,
  };
}

// ─── Recommendations ─────────────────────────────────────────────────────────

const REC_MAP = {
  reputasiDigital: [
    'Minta pelanggan menulis ulasan di Shopee atau Google Maps secara rutin setelah transaksi',
    'Balas setiap ulasan pelanggan dengan ramah — ini meningkatkan kepercayaan pembeli baru',
    'Buat program loyalitas kecil: diskon untuk pelanggan yang meninggalkan ulasan bintang 5',
  ],
  konsistensiOperasional: [
    'Coba buka usaha minimal 6 hari seminggu untuk meningkatkan konsistensi operasional',
    'Aktifkan akun di minimal 2 platform jualan online agar mudah ditemukan calon pembeli',
    'Jadwalkan update produk atau konten minimal seminggu sekali secara konsisten',
  ],
  kematanganBisnis: [
    'Daftarkan usaha ke OSS (oss.go.id) untuk mendapatkan legalitas usaha secara gratis',
    'Pertimbangkan merekrut 1 karyawan paruh waktu untuk membantu operasional harian',
    'Buat catatan keuangan sederhana bulanan — ini meningkatkan kepercayaan lembaga pembiayaan',
  ],
  profilRisiko: [
    'Tambah variasi produk atau layanan untuk mengurangi risiko bisnis satu produk',
    'Diversifikasi ke platform jualan baru seperti TikTok Shop atau Facebook Marketplace',
    'Pertimbangkan menjual produk pelengkap agar pelanggan belanja lebih banyak per transaksi',
  ],
};

export function generateRecommendations(scores) {
  const sorted = Object.entries(scores).sort(([, a], [, b]) => a - b);
  const result = [];

  for (const [dim, score] of sorted) {
    if (result.length >= 5) break;
    if (score < 60) {
      const recs = REC_MAP[dim] || [];
      for (const r of recs) {
        if (result.length < 5) result.push(r);
      }
    }
  }

  // Minimal 3 rekomendasi — ambil dari dimensi terlemah meski skor >= 60
  if (result.length < 3) {
    for (const [dim] of sorted) {
      if (result.length >= 3) break;
      const recs = REC_MAP[dim] || [];
      for (const r of recs) {
        if (!result.includes(r) && result.length < 3) result.push(r);
      }
    }
  }

  return result;
}

// ─── Lender recommendations ──────────────────────────────────────────────────

export function getLenderRecommendations(rating) {
  const KUR_BRI     = { name: 'KUR BRI', desc: 'Kredit Usaha Rakyat, bunga 6%/tahun, max Rp500 juta', url: 'https://bri.co.id' };
  const KUR_MANDIRI = { name: 'KUR Mandiri', desc: 'Pinjaman usaha tanpa agunan, max Rp100 juta', url: 'https://bankmandiri.co.id' };
  const MEKAR       = { name: 'Mekar.id', desc: 'Platform pinjaman UMKM berbasis komunitas', url: 'https://mekar.id' };
  const KREDITPINTAR= { name: 'Kredit Pintar', desc: 'Pinjaman digital cepat cair, max Rp20 juta', url: 'https://kreditpintar.com' };
  const AMARTHA     = { name: 'Amartha', desc: 'P2P lending khusus UMKM perempuan', url: 'https://amartha.com' };
  const KOPERASI    = { name: 'Koperasi Digital', desc: 'Simpan pinjam berbasis komunitas UMKM lokal', url: '#' };

  if (rating === 'A' || rating === 'B') return [KUR_BRI, KUR_MANDIRI, MEKAR];
  if (rating === 'C') return [MEKAR, KREDITPINTAR, AMARTHA];
  return [AMARTHA, KOPERASI];
}
