import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBaris } from '../context/BarisContext';
import Layout from '../components/shared/Layout';
import Button from '../components/shared/Button';
import ScreenshotUploader from '../components/reviews/ScreenshotUploader';
import ManualReviewInput from '../components/reviews/ManualReviewInput';
import ExtractedReviewsList from '../components/reviews/ExtractedReviewsList';

const MIN_REVIEWS = 3;
const MAX_REVIEWS = 10;

const SAMPLE_REVIEWS = [
  'Produknya bagus banget, pengiriman cepat dan penjual ramah!',
  'Sudah beli berkali-kali, kualitas selalu konsisten dan harga terjangkau',
  'Pelayanannya memuaskan, barang sesuai foto, recommended!',
  'Penjual responsif, packing rapi, produk berkualitas tinggi',
  'Harga bersahabat untuk kualitas seperti ini, pasti order lagi',
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function ReviewsPage() {
  const navigate = useNavigate();
  const { setReviews } = useBaris();

  const [reviews, setLocalReviews] = useState(() =>
    SAMPLE_REVIEWS.map(text => ({ id: makeId(), text, source: 'sample' }))
  );
  const [showScreenshot, setShowScreenshot] = useState(false);

  const count = reviews.length;
  const isReady = count >= MIN_REVIEWS;
  const isFull = count >= MAX_REVIEWS;

  const handleManualAdd = (text) => {
    if (isFull) return;
    setLocalReviews((prev) => [...prev, { id: makeId(), text, source: 'manual' }]);
  };

  const handleOCRExtract = (texts) => {
    setLocalReviews((prev) => {
      const existing = new Set(prev.map(r => r.text.toLowerCase().trim()));
      const fresh = texts
        .filter(t => !existing.has(t.toLowerCase().trim()))
        .slice(0, MAX_REVIEWS - prev.length)
        .map(text => ({ id: makeId(), text, source: 'ocr' }));
      return [...prev, ...fresh];
    });
  };

  const handleDelete = (id) => {
    setLocalReviews((prev) => prev.filter(r => r.id !== id));
  };

  const handleAnalyze = () => {
    setReviews(reviews);
    navigate('/menganalisis');
  };

  return (
    <Layout showBack title="Ulasan Pelanggan">
      <div className="mb-6">
        <h1 className="text-h2 text-ink mb-1">Bagikan Ulasan Pelanggan Anda</h1>
        <p className="text-small text-ink2">
          AI kami akan membaca ulasan untuk mengukur reputasi usaha Anda.
        </p>
      </div>

      <ExtractedReviewsList
        reviews={reviews}
        onDelete={handleDelete}
      />

      <div className="mt-4">
        <ManualReviewInput onAdd={handleManualAdd} disabled={isFull} />
      </div>

      <div className="mt-3">
        <button
          onClick={() => setShowScreenshot((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-line
            rounded-xl text-label font-medium text-ink2 hover:bg-surface2 hover:text-ink transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>📸</span>
            <span>Upload Screenshot</span>
          </span>
          <span className={`text-xs transition-transform duration-200 ${showScreenshot ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </button>

        {showScreenshot && (
          <div className="mt-3">
            <ScreenshotUploader onExtract={handleOCRExtract} disabled={isFull} />
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-xl text-label font-medium
          ${isReady ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}
        >
          <span>{isReady ? '✅' : '⏳'}</span>
          <span>
            {count} ulasan terkumpul
            {!isReady && ` — butuh ${MIN_REVIEWS - count} lagi`}
            {isFull && ' — batas maksimal tercapai'}
          </span>
        </div>

        <Button
          variant="primary"
          size="full"
          onClick={handleAnalyze}
          disabled={!isReady}
        >
          Analisis Sekarang →
        </Button>
        {!isReady && count > 0 && (
          <p className="text-center text-micro text-ink3 mt-2">
            Tambahkan {MIN_REVIEWS - count} ulasan lagi untuk melanjutkan
          </p>
        )}
      </div>
    </Layout>
  );
}
