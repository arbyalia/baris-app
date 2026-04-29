import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children, showBack = false, title = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <header className="sticky top-0 z-50 bg-navy shadow-sm">
        <div className="max-w-2xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Kembali"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <img src="/BARIS.png" alt="BARIS" className="h-12 w-auto" />
          </div>

          <span className="text-label text-white/60 font-medium">
            {isHome ? 'AI Impact Challenge' : title}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        {children}
      </main>

      <footer className="border-t border-line py-4 text-center">
        <p className="text-micro text-ink3">
          BARIS © 2026 · Gratis & Aman · Data tidak disimpan
        </p>
      </footer>
    </div>
  );
}
