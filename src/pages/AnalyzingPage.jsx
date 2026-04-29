import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBaris } from '../context/BarisContext';
import { analyzeSentiment } from '../services/azureLanguage';

const MESSAGES = [
  'Membaca ulasan pelanggan Anda...',
  'Menganalisis sentimen dengan AI...',
  'Menghitung reputasi digital usaha...',
  'Menyusun profil kelayakan kredit...',
  'Hampir selesai...',
];

export default function AnalyzingPage() {
  const navigate = useNavigate();
  const { reviews, setSentimentResults } = useBaris();

  const [msgIndex, setMsgIndex] = useState(0);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (status !== 'loading') return;
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % MESSAGES.length), 2000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (!reviews || reviews.length === 0) { navigate('/ulasan', { replace: true }); return; }
    let cancelled = false;
    setStatus('loading');
    setMsgIndex(0);
    const reviewTexts = reviews.map(r => (typeof r === 'string' ? r : r.text));
    analyzeSentiment(reviewTexts)
      .then((results) => {
        if (cancelled) return;
        setSentimentResults(results);
        navigate('/dashboard', { replace: true });
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg(err.message || 'Gagal menganalisis ulasan. Silakan coba lagi.');
      });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryKey]);

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6">
      {status === 'loading' && (
        <div className="text-center max-w-xs w-full">
          <div className="w-12 h-12 mx-auto mb-8 border-2 border-line border-t-brand rounded-full animate-spin" />

          <p className="text-h3 text-ink font-semibold mb-2">BARIS sedang bekerja</p>
          <p key={msgIndex} className="text-small text-ink2 animate-slide-in-right min-h-[24px]">
            {MESSAGES[msgIndex]}
          </p>

          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>

          <p className="text-micro text-ink3 mt-8">Menggunakan Azure AI Language · Privasi terjaga</p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center max-w-xs w-full">
          <div className="w-16 h-16 mx-auto mb-6 bg-danger-bg rounded-2xl flex items-center justify-center text-3xl">
            😕
          </div>
          <p className="text-h3 text-ink font-semibold mb-2">Ada kendala</p>
          <p className="text-small text-ink2 mb-8 leading-relaxed">{errorMsg}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setRetryKey((k) => k + 1)}
              className="w-full bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand/90 transition-colors active:scale-[0.98]"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => navigate('/ulasan')}
              className="w-full border border-line text-ink2 font-medium py-3 rounded-xl hover:bg-surface2 transition-colors"
            >
              Kembali ke Ulasan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
