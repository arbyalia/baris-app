import React, { useState, useRef } from 'react';
import { extractTextFromImage } from '../../services/azureVision';
import { extractReviewsFromText } from '../../utils/reviewExtractor';

const MAX_FILES = 5;
const MAX_MB = 5;

export default function ScreenshotUploader({ onExtract, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const processFiles = async (fileList) => {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));

    if (files.length === 0) {
      setError('Pilih file gambar (PNG atau JPG).');
      return;
    }
    const oversized = files.filter(f => f.size > MAX_MB * 1024 * 1024);
    if (oversized.length > 0) {
      setError(`File terlalu besar. Maksimal ${MAX_MB}MB per gambar.`);
      return;
    }
    const limited = files.slice(0, MAX_FILES);

    setError('');
    setProgress({ current: 0, total: limited.length });

    const allTexts = [];
    for (let i = 0; i < limited.length; i++) {
      setProgress({ current: i + 1, total: limited.length });
      try {
        const lines = await extractTextFromImage(limited[i]);
        allTexts.push(...lines);
      } catch (err) {
        setProgress(null);
        setError(err.message || 'Gagal membaca gambar. Coba lagi.');
        return;
      }
    }

    setProgress(null);
    const reviews = extractReviewsFromText(allTexts);

    if (reviews.length === 0) {
      setError('Tidak ditemukan ulasan dalam screenshot. Pastikan screenshot memperlihatkan halaman ulasan.');
      return;
    }

    onExtract(reviews);
  };

  const handleFiles = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const isUploading = progress !== null;
  const pct = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="space-y-3">
      <label
        className={`block w-full bg-surface border-2 border-dashed rounded-2xl p-8 md:p-10
          text-center transition-all duration-200
          ${disabled || isUploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          ${isDragging ? 'border-brand bg-surface2' : 'border-sky/40 hover:border-brand hover:bg-surface2'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
          disabled={disabled || isUploading}
        />

        {isUploading ? (
          <>
            <div className="w-10 h-10 mx-auto mb-4 border-2 border-line border-t-brand rounded-full animate-spin" />
            <p className="text-body font-semibold text-navy mb-1">
              Membaca ulasan dari screenshot...
            </p>
            <p className="text-small text-ink2 mb-3">
              {progress.current} dari {progress.total} gambar · {pct}% selesai
            </p>
            <p className="text-micro text-ink3 uppercase tracking-widest">
              Powered by Azure Computer Vision
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-3">📸</div>
            <p className="text-body font-semibold text-ink mb-1">
              Drag & drop atau klik untuk upload
            </p>
            <p className="text-small text-ink2 mb-4">
              Maksimal {MAX_FILES} screenshot · PNG/JPG · Max {MAX_MB}MB per file
            </p>
            <span className="inline-block bg-brand text-white px-4 py-2 rounded-xl text-label font-semibold">
              Pilih Screenshot
            </span>
          </>
        )}
      </label>

      {error && (
        <p className="text-small text-danger bg-danger-bg px-4 py-2 rounded-xl">{error}</p>
      )}

      <div className="bg-surface2 rounded-xl p-4 flex gap-3">
        <span className="text-lg flex-shrink-0">💡</span>
        <div>
          <p className="text-label font-semibold text-navy mb-1">Tips screenshot ulasan:</p>
          <ul className="text-small text-ink2 space-y-0.5 list-disc list-inside">
            <li>Shopee: Toko Saya → Ulasan → screenshot</li>
            <li>Tokopedia: Toko → Ulasan Produk → screenshot</li>
            <li>Google Maps: Cari toko → Ulasan → screenshot</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
