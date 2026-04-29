# DESIGN.md — BARIS Design Guideline v3
> Wajib dibaca sebelum menyentuh file UI.
> Last updated: 27 April 2026

---

## 1. Filosofi Desain

**Fresh Blue System** — familiar, profesional, terpercaya, namun modern.

Prinsip:
- **Trustworthy first** — biru navy bangun kepercayaan
- **Clarity over decoration** — angka tidak boleh terhalang
- **Warm & approachable** — target ibu-ibu UMKM
- **Consistent identity** — motif garis horizontal dari logo
- **Mobile-first always**

---

## 2. Logo & Brand Identity

### Versi Header (di atas navy)
```jsx
<div className="flex items-center gap-2">
  <span className="font-bold text-lg tracking-widest text-white">BARIS</span>
  <div className="flex flex-col gap-[3px]">
    <div className="w-4 h-[2.5px] bg-white rounded-full"></div>
    <div className="w-3 h-[2.5px] bg-white/60 rounded-full"></div>
    <div className="w-2 h-[2.5px] bg-white/35 rounded-full"></div>
  </div>
</div>
```

### Versi Terang (di atas canvas/putih)
```jsx
<div className="flex items-center gap-2">
  <span className="font-bold text-lg tracking-widest text-navy">BARIS</span>
  <div className="flex flex-col gap-[3px]">
    <div className="w-4 h-[2.5px] bg-navy rounded-full"></div>
    <div className="w-3 h-[2.5px] bg-brand rounded-full"></div>
    <div className="w-2 h-[2.5px] bg-sky rounded-full"></div>
  </div>
</div>
```

---

## 3. Typography — Poppins

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
body { font-family: 'Poppins', system-ui, sans-serif; }
```

### Type Scale (tailwind.config.js)
```js
fontSize: {
  'score': ['3.5rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.02em' }],
  'h1':    ['2rem',   { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
  'h2':    ['1.5rem', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.01em' }],
  'h3':    ['1.125rem',{ lineHeight: '1.4', fontWeight: '600' }],
  'body':  ['1rem',   { lineHeight: '1.65', fontWeight: '400' }],
  'small': ['0.875rem',{ lineHeight: '1.5', fontWeight: '400' }],
  'label': ['0.8125rem',{ lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.01em' }],
  'micro': ['0.6875rem',{ lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.06em' }],
}
```

---

## 4. Color Tokens (tailwind.config.js)

```js
colors: {
  'canvas':      '#F0F5FF',
  'surface':     '#FFFFFF',
  'surface2':    '#E8F0FD',
  'navy':        '#1A3A6B',
  'brand':       '#2563EB',
  'sky':         '#4A7FC1',
  'ink':         '#0F172A',
  'ink2':        '#475569',
  'ink3':        '#94A3B8',
  'line':        '#E2E8F0',
  'success':     '#16A34A',
  'success-bg':  '#DCFCE7',
  'warning':     '#CA8A04',
  'warning-bg':  '#FEF9C3',
  'danger':      '#DC2626',
  'danger-bg':   '#FEE2E2',
}
```

### Warna DILARANG
- ❌ `#1E4E8C` `#2E86C1` `#D6E4F0` `#F8F9FA` `#2C3E50`
- ❌ `#27AE60` `#F39C12` `#E74C3C`

---

## 5. Border, Radius & Shadow

```
rounded-lg   → 8px   — input, tag kecil
rounded-xl   → 12px  — button
rounded-2xl  → 16px  — card
rounded-3xl  → 24px  — score card
rounded-full → pill  — badge

border border-line   → semua card/input

shadow-sm   → floating element
shadow-none → default
```

Touch target minimum **44px tinggi** di mobile.

---

## 6. Score Display — Opsi B (WAJIB)

```jsx
// src/components/dashboard/ScoreDisplay.jsx
import React, { useEffect, useState } from 'react';

const RATING_CONFIG = {
  A: { label: 'Sangat Layak',      textColor: '#16A34A', bgColor: '#DCFCE7', progress: '#22C55E' },
  B: { label: 'Layak',             textColor: '#16A34A', bgColor: '#DCFCE7', progress: '#22C55E' },
  C: { label: 'Cukup Layak',       textColor: '#CA8A04', bgColor: '#FEF9C3', progress: '#F59E0B' },
  D: { label: 'Perlu Peningkatan', textColor: '#DC2626', bgColor: '#FEE2E2', progress: '#EF4444' },
  E: { label: 'Belum Layak',       textColor: '#DC2626', bgColor: '#FEE2E2', progress: '#EF4444' },
};

function ScoreDisplay({ score, rating, businessName, confidence }) {
  const [displayScore, setDisplayScore] = useState(0);
  const config = RATING_CONFIG[rating] || RATING_CONFIG['C'];

  useEffect(() => {
    let start = 0;
    const step = 16;
    const increment = score / (1200 / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) { setDisplayScore(score); clearInterval(timer); }
      else { setDisplayScore(Math.round(start)); }
    }, step);
    return () => clearInterval(timer);
  }, [score]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="bg-navy rounded-3xl p-8 text-center">
      <p className="text-micro text-white/50 uppercase tracking-widest mb-1">
        Skor Kelayakan Kredit
      </p>
      <p className="text-small text-white/70 font-medium mb-6">{businessName}</p>

      <div className="relative w-36 h-36 mx-auto mb-6">
        <svg viewBox="0 0 120 120" width="144" height="144" className="-rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none"
            stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
          <circle cx="60" cy="60" r={radius} fill="none"
            stroke={config.progress} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={progressOffset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-white leading-none"
            style={{ fontSize: '2.75rem', fontFamily: 'Poppins, sans-serif' }}>
            {displayScore}
          </span>
          <span className="text-white/50 font-medium mt-0.5" style={{ fontSize: '13px' }}>
            / 100
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <span className="px-3 py-1 rounded-full text-label font-semibold"
          style={{ backgroundColor: config.bgColor, color: config.textColor }}>
          Rating {rating}
        </span>
        <span className="text-white/70 text-small">{config.label}</span>
      </div>

      {confidence && (
        <p className="text-white/40 text-micro uppercase tracking-wider mt-4">
          Kepercayaan AI: {confidence}%
        </p>
      )}
    </div>
  );
}

export default ScoreDisplay;
```

---

## 7. Component Patterns

### Button
```jsx
// Primary
<button className="bg-brand hover:bg-brand/90 text-white font-semibold px-6 py-3 rounded-xl text-label transition-all duration-200 active:scale-[0.98]">
  Mulai Penilaian →
</button>

// Secondary
<button className="bg-surface border-2 border-navy text-navy font-semibold px-6 py-3 rounded-xl text-label hover:bg-surface2 transition-all duration-200">
  Pelajari Dulu
</button>

// Ghost
<button className="text-ink2 font-medium px-4 py-3 rounded-xl text-label hover:bg-surface2 hover:text-ink transition-all duration-200">
  Paste manual saja
</button>
```

### Card
```jsx
<div className="bg-surface border border-line rounded-2xl p-6 md:p-8">{content}</div>
```

### Option Button (Onboarding)
```jsx
<button className={`w-full text-left border-2 rounded-xl px-5 py-4 text-body font-medium transition-all duration-200
  ${selected ? 'border-brand bg-surface2 text-brand' : 'border-line bg-surface text-ink hover:border-sky hover:bg-canvas'}`}>
  {label}
</button>
```

### Header
```jsx
<header className="sticky top-0 z-50 bg-navy shadow-sm">
  <div className="max-w-2xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="font-bold text-lg tracking-widest text-white">BARIS</span>
      <div className="flex flex-col gap-[3px]">
        <div className="w-4 h-[2.5px] bg-white rounded-full"></div>
        <div className="w-3 h-[2.5px] bg-white/60 rounded-full"></div>
        <div className="w-2 h-[2.5px] bg-white/35 rounded-full"></div>
      </div>
    </div>
    <span className="text-label text-white/60 font-medium">{pageLabel}</span>
  </div>
</header>
```

### Layout
```jsx
<div className="min-h-screen bg-canvas">
  <Header />
  <main className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">{children}</main>
</div>
```

---

## 8. Screenshot Upload UI (Halaman Reviews) ⭐ BARU

Halaman `/ulasan` redesign untuk dukung **2 mode input**: OCR (primary) + Manual (fallback).

### Layout Halaman

```
┌─────────────────────────────────────┐
│ Bagikan Ulasan Pelanggan Anda       │
│ AI kami akan baca otomatis dari     │
│ screenshot Shopee/Tokopedia/Google  │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [DROPZONE BESAR — DASHED BORDER]│ │
│ │                                 │ │
│ │     📸 Drag & drop atau         │ │
│ │     klik untuk upload           │ │
│ │     (max 5 screenshot)          │ │
│ │                                 │ │
│ │     PNG, JPG, max 5MB/file      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Tips: Buka aplikasi Shopee →        │
│ pilih "Lihat Semua Ulasan" → SS     │
│                                     │
│ ── atau ──                          │
│                                     │
│ [+ Paste manual ulasan]             │
├─────────────────────────────────────┤
│ ULASAN TERKUMPUL (5)                │
│ ┌─────────────────────────────────┐ │
│ │ #1 [📷 ss] "Produknya bagus..." │ │
│ │           [edit] [hapus]        │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ #2 [✏️ manual] "Ramah penjual.."│ │
│ │           [edit] [hapus]        │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│       [Analisis Sekarang →]         │
└─────────────────────────────────────┘
```

### Komponen 1 — ScreenshotUploader.jsx

```jsx
function ScreenshotUploader({ onExtract }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <label className="
        block w-full
        bg-surface border-2 border-dashed border-sky/40
        rounded-2xl p-8 md:p-10
        text-center cursor-pointer
        hover:border-brand hover:bg-surface2
        transition-all duration-200
      ">
        <input type="file" accept="image/*" multiple className="hidden"
          onChange={handleFiles} />

        {!uploading ? (
          <>
            <div className="text-4xl mb-3">📸</div>
            <p className="text-body font-semibold text-ink mb-1">
              Drag & drop atau klik untuk upload
            </p>
            <p className="text-small text-ink2 mb-3">
              Maksimal 5 screenshot · PNG/JPG · Max 5MB per file
            </p>
            <span className="inline-block bg-brand text-white px-4 py-2 rounded-xl text-label font-semibold">
              Pilih Screenshot
            </span>
          </>
        ) : (
          <>
            <LoadingSpinner />
            <p className="text-body font-semibold text-navy mt-3">
              Membaca ulasan dari screenshot...
            </p>
            <p className="text-small text-ink2 mt-1">
              {progress}% selesai · Powered by Azure Computer Vision
            </p>
          </>
        )}
      </label>

      {/* Tips */}
      <div className="bg-surface2 rounded-xl p-4 flex gap-3">
        <span className="text-lg">💡</span>
        <div>
          <p className="text-label font-semibold text-navy mb-1">Tips screenshot ulasan:</p>
          <ul className="text-small text-ink2 space-y-0.5 list-disc list-inside">
            <li>Shopee: Toko Saya → Ulasan → screenshot</li>
            <li>Tokopedia: Toko → Ulasan Produk → screenshot</li>
            <li>Google Maps: cari toko → Ulasan → screenshot</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

### Komponen 2 — ManualReviewInput.jsx (Fallback)

```jsx
function ManualReviewInput({ onAdd }) {
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState('');

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="w-full text-ink2 font-medium px-4 py-3 rounded-xl text-label hover:bg-surface2 hover:text-ink transition-all duration-200 border border-dashed border-line"
      >
        + Paste manual ulasan
      </button>
    );
  }

  return (
    <div className="bg-surface border border-line rounded-2xl p-4 space-y-3">
      <textarea
        rows={3}
        placeholder="Tempel ulasan pelanggan di sini..."
        className="w-full bg-canvas border border-line rounded-xl px-3 py-2 text-body resize-none focus:outline-none focus:ring-2 focus:ring-brand"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex gap-2 justify-end">
        <button onClick={() => { setShowInput(false); setText(''); }}
          className="text-ink2 px-4 py-2 rounded-xl text-label font-medium hover:bg-surface2">
          Batal
        </button>
        <button onClick={() => { onAdd(text); setText(''); setShowInput(false); }}
          disabled={text.length < 10}
          className="bg-brand text-white px-4 py-2 rounded-xl text-label font-semibold disabled:opacity-40">
          Tambah
        </button>
      </div>
    </div>
  );
}
```

### Komponen 3 — ExtractedReviewsList.jsx

```jsx
function ExtractedReviewsList({ reviews, onDelete, onEdit }) {
  if (reviews.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-micro text-ink3 uppercase tracking-widest font-semibold">
        Ulasan Terkumpul ({reviews.length})
      </p>

      {reviews.map((review, i) => (
        <div key={review.id} className="bg-surface border border-line rounded-2xl p-4">
          <div className="flex items-start gap-3">
            {/* Index + Source Icon */}
            <div className="flex flex-col items-center gap-1 pt-1">
              <span className="text-label font-bold text-brand">#{i + 1}</span>
              <span className="text-base" title={review.source === 'ocr' ? 'Dari screenshot' : 'Manual'}>
                {review.source === 'ocr' ? '📷' : '✏️'}
              </span>
            </div>

            {/* Content */}
            <p className="flex-1 text-body text-ink leading-relaxed">{review.text}</p>

            {/* Actions */}
            <div className="flex flex-col gap-1">
              <button onClick={() => onEdit(review.id)}
                className="text-ink3 hover:text-brand p-1" title="Edit">✏️</button>
              <button onClick={() => onDelete(review.id)}
                className="text-ink3 hover:text-danger p-1" title="Hapus">✕</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 9. Responsive

Mobile-first. Default = 375px, override `md:` (768px+), `lg:` (1024px+).

| Element | Mobile | Desktop |
|---|---|---|
| Heading hero | `text-h2` | `md:text-h1` |
| Card padding | `p-6` | `md:p-8` |
| Dimension grid | `grid-cols-1` | `sm:grid-cols-2` |
| Dropzone padding | `p-8` | `md:p-10` |
| Button | `w-full` | `md:w-auto` |

---

## 10. PDF Report — Design Konsisten

### Warna PDF
```js
const PDF = {
  navy:       '#1A3A6B',
  brand:      '#2563EB',
  canvas:     '#F0F5FF',
  surface2:   '#E8F0FD',
  line:       '#E2E8F0',
  ink:        '#0F172A',
  ink2:       '#475569',
  ink3:       '#94A3B8',
  successBg:  '#DCFCE7', successText: '#16A34A',
  warningBg:  '#FEF9C3', warningText: '#CA8A04',
  dangerBg:   '#FEE2E2', dangerText:  '#DC2626',
};
```

### Struktur
- **HEADER** — bg navy, wordmark BARIS putih + 3 garis motif logo, nomor referensi & tanggal
- **PROFIL USAHA** — tabel 2 kolom, alternating row canvas/white
- **HASIL PENILAIAN** — box bg navy, circle progress + skor besar putih, rating badge
- **RINCIAN PER DIMENSI** — tabel 4 kolom, progress bar warna sesuai skor
- **REKOMENDASI** — numbered list bullet brand
- **LEMBAGA PEMBIAYAAN** — card grid 2 kolom
- **FOOTER** — border atas navy, teks micro abu

**Wajib muat di 1 halaman.** Kurangi padding jika overflow.

---

## 11. Checklist Sebelum Push

- [ ] Poppins import di public/index.html
- [ ] Color tokens baru di tailwind.config.js
- [ ] ScoreGauge.jsx dihapus, ScoreDisplay.jsx dibuat
- [ ] Score tidak tertutup di Rating A, C, E
- [ ] Header bg-navy + logo motif garis
- [ ] **ScreenshotUploader + ManualReviewInput + ExtractedReviewsList** dibuat
- [ ] Azure Vision API terintegrasi
- [ ] PDF header navy, layout 1 halaman
- [ ] Responsive 375px → 1280px
- [ ] Tidak ada warna palette lama

---

**Status: Active**
