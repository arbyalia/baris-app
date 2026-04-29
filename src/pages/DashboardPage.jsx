import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBaris } from '../context/BarisContext';
import { calculateScore, generateRecommendations, getLenderRecommendations } from '../utils/scoringEngine';
import Layout from '../components/shared/Layout';
import ScoreDisplay from '../components/dashboard/ScoreDisplay';
import DimensionCard from '../components/dashboard/DimensionCard';
import RecommendationList from '../components/dashboard/RecommendationList';
import SimulatorPanel from '../components/simulator/SimulatorPanel';
import { generatePDF } from '../utils/pdfGenerator';

const DIMENSIONS = [
  {
    key: 'reputasiDigital',
    icon: '🌟',
    name: 'Reputasi Digital',
    desc: 'Diukur dari sentimen ulasan pelanggan Anda secara keseluruhan.',
  },
  {
    key: 'konsistensiOperasional',
    icon: '⚡',
    name: 'Konsistensi Operasional',
    desc: 'Mencerminkan keaktifan usaha — hari operasi, platform online, dan frekuensi update.',
  },
  {
    key: 'kematanganBisnis',
    icon: '🏢',
    name: 'Kematangan Bisnis',
    desc: 'Menggambarkan seberapa mapan usaha Anda dari sisi usia, skala, dan kategori.',
  },
  {
    key: 'profilRisiko',
    icon: '🛡️',
    name: 'Profil Risiko',
    desc: 'Menilai diversifikasi produk dan saluran penjualan untuk meminimalisir risiko.',
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    answers, sentimentResults,
    scores, setScores,
    totalScore, setTotalScore,
    rating, setRating,
    confidenceScore, setConfidenceScore,
  } = useBaris();

  useEffect(() => {
    if (!sentimentResults || sentimentResults.length === 0) {
      navigate('/', { replace: true });
    }
  }, [sentimentResults, navigate]);

  useEffect(() => {
    if (!sentimentResults || sentimentResults.length === 0) return;
    if (totalScore !== null) return;

    const result = calculateScore(answers, sentimentResults);
    setScores(result.scores);
    setTotalScore(result.totalScore);
    setRating(result.rating);
    setConfidenceScore(result.confidenceScore);
  }, [sentimentResults]); // eslint-disable-line react-hooks/exhaustive-deps

  const recommendations = useMemo(
    () => (scores ? generateRecommendations(scores) : []),
    [scores]
  );
  const lenders = useMemo(
    () => (rating ? getLenderRecommendations(rating) : []),
    [rating]
  );

  const [pdfLoading, setPdfLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handlePdfDownload = async () => {
    setPdfLoading(true);
    try {
      await generatePDF({ answers, scores, totalScore, rating, confidenceScore, recommendations, lenders });
      setToast('success');
    } catch (_) {
      setToast('error');
    } finally {
      setPdfLoading(false);
    }
  };

  if (totalScore === null || !rating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="w-8 h-8 border-2 border-line border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Layout title="Hasil Penilaian">
      <div className="mb-6">
        <ScoreDisplay
          score={totalScore}
          rating={rating}
          businessName={answers.businessName}
          confidence={confidenceScore}
        />
      </div>

      <section className="mb-6">
        <p className="text-micro text-ink3 uppercase tracking-widest mb-4">Rincian per Dimensi</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DIMENSIONS.map((d) => (
            <DimensionCard
              key={d.key}
              icon={d.icon}
              name={d.name}
              score={scores[d.key]}
              description={d.desc}
            />
          ))}
        </div>
      </section>

      <SimulatorPanel originalScore={totalScore} />

      <section className="mb-24">
        <RecommendationList recommendations={recommendations} lenders={lenders} />
      </section>

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-sm text-white text-label
          font-semibold flex items-center gap-2 animate-slide-in-right
          ${toast === 'success' ? 'bg-success' : 'bg-danger'}`}
        >
          <span>{toast === 'success' ? '✅' : '❌'}</span>
          <span>{toast === 'success' ? 'Laporan berhasil diunduh!' : 'Gagal mengunduh, coba lagi'}</span>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-canvas/95 backdrop-blur-md border-t border-line px-4 py-3 z-10">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handlePdfDownload}
            disabled={pdfLoading}
            className={`w-full text-white font-semibold py-3 rounded-xl transition-colors
              flex items-center justify-center gap-2
              ${pdfLoading
                ? 'bg-brand/50 cursor-not-allowed'
                : 'bg-brand hover:bg-brand/90 active:scale-[0.98]'
              }`}
          >
            {pdfLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Menyiapkan laporan...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Unduh Laporan PDF
              </>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
}
