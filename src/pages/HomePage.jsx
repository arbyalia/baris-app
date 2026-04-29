import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import Button from '../components/shared/Button';

const STEPS = [
  { icon: '📝', number: '1', title: 'Ceritakan Usaha Anda', desc: 'Jawab 8 pertanyaan singkat. Hanya butuh 3–5 menit.' },
  { icon: '⭐', number: '2', title: 'Bagikan Ulasan Pelanggan', desc: 'Paste ulasan dari Shopee, Tokopedia, atau Google.' },
  { icon: '📊', number: '3', title: 'Dapatkan Skor & Rekomendasi', desc: 'Lihat skor dan langkah konkret untuk meningkatkannya.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-canvas py-12 md:py-20 -mx-4 md:-mx-6 px-4 md:px-6 mb-8 md:mb-12">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.07) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(26,58,107,0.05) 0%, transparent 60%)
            `,
          }}
        />
        <div className="relative z-10 text-center">
          <span className="inline-flex items-center bg-surface2 text-brand px-3 py-1 rounded-full text-label font-semibold mb-6">
            Gratis · Tanpa Registrasi · Aman
          </span>

          <h1 className="text-h2 md:text-h1 text-ink mb-4 leading-tight">
            Ketahui kelayakan kredit
            <br />
            usaha Anda sekarang
          </h1>

          <p className="text-small text-ink2 mb-8 max-w-md mx-auto">
            BARIS menilai kelayakan kredit UMKM Anda menggunakan kecerdasan buatan —
            tanpa laporan keuangan formal, tanpa biaya.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" size="lg" onClick={() => navigate('/mulai')}>
              Mulai Penilaian Gratis →
            </Button>
          </div>

          <p className="text-micro text-ink3 mt-4">
            Sudah digunakan oleh 1.200+ pelaku UMKM Indonesia
          </p>
        </div>
      </section>

      {/* ── Cara Kerja ── */}
      <section className="mb-8 md:mb-12">
        <p className="text-micro text-ink3 uppercase tracking-widest text-center mb-6">Cara kerja BARIS</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-surface border border-line rounded-2xl p-6 hover:-translate-y-0.5 transition-transform duration-200"
            >
              <div className="w-10 h-10 bg-surface2 rounded-xl flex items-center justify-center text-xl mb-4">
                {step.icon}
              </div>
              <p className="text-micro text-ink3 uppercase tracking-widest mb-2">Langkah {step.number}</p>
              <p className="text-h3 text-ink mb-1">{step.title}</p>
              <p className="text-small text-ink2">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="bg-surface border border-line rounded-2xl p-6 md:p-8 mb-8">
        <p className="text-micro text-ink3 uppercase tracking-widest text-center mb-6">
          Dipercaya pelaku UMKM Indonesia
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { val: '1.200+', label: 'UMKM dinilai' },
            { val: '78%',    label: 'Dapat pembiayaan' },
            { val: '4.8★',   label: 'Rating pengguna' },
          ].map(({ val, label }) => (
            <div key={label}>
              <p className="text-h2 text-navy font-bold">{val}</p>
              <p className="text-micro text-ink3 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimoni ── */}
      <section className="bg-surface2 rounded-2xl p-6 mb-8">
        <p className="text-small text-ink2 leading-relaxed mb-3 italic">
          "Saya tidak menyangka toko kue rumahan saya bisa dapat skor B dan langsung dapat
          rekomendasi KUR BRI. Prosesnya mudah banget!"
        </p>
        <p className="text-label text-ink3">— Sri Wahyuni, Penjual Kue Rumahan, Surabaya</p>
      </section>

      {/* ── CTA bawah ── */}
      <Button variant="secondary" size="full" onClick={() => navigate('/mulai')} className="mb-4">
        Coba Sekarang — Gratis
      </Button>
    </Layout>
  );
}
