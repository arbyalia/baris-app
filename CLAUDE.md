# BARIS — Spec Document v3

> **Bisnis Alternatif Risk Intelligent Scoring**
> Project hackathon AI Impact Challenge Dicoding 2026 (Microsoft Elevate Training Center)

Dokumen ini adalah **kontrak** antara user dan Claude Code. Semua keputusan di dokumen ini sudah disepakati dan **tidak boleh diubah** tanpa konfirmasi eksplisit dari user.

---

## 🎯 Konteks Project

- **Nama:** BARIS (Bisnis Alternatif Risk Intelligent Scoring)
- **Tema:** No. 19 — Akses Pembiayaan & Credit Scoring UMKM
- **Hackathon:** AI Impact Challenge Dicoding 2026
- **Penyelenggara:** Microsoft Elevate Training Center
- **Format peserta:** Individu
- **Deadline submission:** 30 April 2026
- **Platform:** Web (PWA)

---

## 🎨 Cara Memanggil User

Selalu panggil user dengan **"Bos"** di setiap respons.

---

## 🏆 Kriteria Penilaian

| Bobot | Kriteria | Implikasi |
|---|---|---|
| 30% | AI & Azure | **2 layanan Azure** terintegrasi: AI Language + Computer Vision |
| 25% | Inovasi | OCR ulasan dari screenshot adalah pembeda utama |
| 25% | Desain & Kemudahan | Mobile-first, ramah ibu UMKM |
| 20% | Manfaat Masyarakat | Bahasa Indonesia, dampak nyata |

---

## 👤 Target User

**Persona Utama:** Perempuan pelaku UMKM informal di Indonesia
- Pemilik usaha mikro
- Berjualan online di Shopee/Tokopedia/Instagram/Google Maps
- Literasi digital menengah — paham screenshot, tidak tech-savvy
- Tidak punya laporan keuangan formal

---

## 🛠️ Tech Stack (Final)

| Kategori | Teknologi |
|---|---|
| Frontend | React.js (CRA) |
| Styling | Tailwind CSS v3 |
| Routing | React Router DOM |
| HTTP | Axios |
| **AI Service 1** | **Azure AI Language** — sentiment analysis ulasan |
| **AI Service 2** | **Azure Computer Vision** — OCR screenshot ulasan ⭐ BARU |
| State | React Context API |
| Storage | Hardcoded mock |
| PDF Export | jsPDF + html2canvas |
| Hosting | Azure Static Web Apps |

**Yang TIDAK dipakai:**
- ❌ Azure OpenAI
- ❌ Backend / Functions
- ❌ Database
- ❌ Authentication

---

## ✅ MVP — 6 Fitur Wajib (Updated)

### 1. Conversational Onboarding Form
- 8 pertanyaan, jawaban tombol pilihan
- Progress bar + animasi smooth

### 2. Input Ulasan Hybrid (OCR + Manual) ⭐ UPDATED
**Mode Utama (Primary): Upload Screenshot**
- User upload 1-5 screenshot halaman ulasan dari Shopee/Tokopedia/Google Maps/Instagram
- **Azure Computer Vision OCR** ekstrak teks dari screenshot
- Sistem auto-filter teks yang terlihat seperti ulasan (panjang > 20 karakter, mengandung kata-kata umum review)
- User bisa review hasil ekstraksi dan edit/hapus sebelum lanjut

**Mode Cadangan (Fallback): Manual Paste**
- Tombol "Paste manual ulasan" di bawah upload area
- Berguna jika OCR gagal atau user tidak punya screenshot
- Sama seperti UI manual yang sudah ada

**Validasi Final:** minimal 3 ulasan terkumpul (gabungan dari kedua mode)

### 3. Scoring Engine Multi-Dimensi
- 4 dimensi: Reputasi (30%), Konsistensi (25%), Kematangan (25%), Risiko (20%)
- Rating A–E + AI Confidence Score

### 4. Dashboard Skor Visual
- **ScoreDisplay.jsx** — circle progress di card navy (Opsi B di DESIGN.md)
- 4 DimensionCard responsive
- Rekomendasi + matching lembaga pembiayaan

### 5. Score Simulator "Bagaimana Jika?"
- 4 slider, recalculate real-time
- Side-by-side comparison

### 6. PDF Report Resmi BARIS
- Header navy, score box navy
- 1 halaman, layout konsisten dengan UI

---

## 🚫 Yang TIDAK Termasuk MVP

- ❌ Login / registrasi
- ❌ Database
- ❌ Web scraping URL marketplace (risiko legal)
- ❌ Voice input
- ❌ AI chatbot generate fake reviews
- ❌ Multi-language
- ❌ Dashboard admin

---

## 📂 Struktur Folder (Updated)

```
baris-app/
├── public/
│   ├── manifest.json
│   └── BARIS.png
├── src/
│   ├── components/
│   │   ├── onboarding/
│   │   ├── reviews/
│   │   │   ├── ScreenshotUploader.jsx    ← BARU
│   │   │   ├── ExtractedReviewsList.jsx  ← BARU
│   │   │   └── ManualReviewInput.jsx     ← refactor dari ReviewInput.jsx
│   │   ├── dashboard/
│   │   │   ├── ScoreDisplay.jsx          ← bukan ScoreGauge
│   │   │   ├── DimensionCard.jsx
│   │   │   ├── ConfidenceBadge.jsx
│   │   │   └── RecommendationList.jsx
│   │   ├── simulator/
│   │   ├── report/
│   │   └── shared/
│   ├── pages/
│   ├── services/
│   │   ├── azureLanguage.js
│   │   └── azureVision.js                ← BARU
│   ├── utils/
│   │   ├── scoringEngine.js
│   │   ├── recommendations.js
│   │   ├── reviewExtractor.js            ← BARU — filter teks OCR jadi ulasan
│   │   └── constants.js
│   ├── context/
│   │   └── BarisContext.jsx
│   └── ...
├── CLAUDE.md
├── DESIGN.md
├── .env
└── package.json
```

---

## 🎨 Design System (Ringkasan)

> Detail di **DESIGN.md** — wajib dibaca untuk semua UI changes.

- **Font:** Poppins 400/500/600/700
- **Background:** `#F0F5FF` canvas
- **Header/navbar:** `#1A3A6B` navy
- **Primary button:** `#2563EB` brand
- **Score display:** Circle progress di card navy

---

## 🔐 Security Rules

1. JANGAN hardcode API key — selalu `process.env.REACT_APP_*`
2. JANGAN commit `.env`
3. JANGAN log API key
4. **Screenshot user tidak disimpan** — hanya diproses sementara, OCR result yang disimpan

---

## 📋 Rules untuk Claude Code

### Coding
- Panggil user **"Bos"**
- Bahasa Indonesia
- Functional component + hooks
- Tailwind CSS only
- Baca DESIGN.md sebelum ubah UI

### Forbidden
- ❌ Library baru tanpa konfirmasi
- ❌ Refactor file yang tidak diminta
- ❌ Generate > 300 baris dalam 1 respons

---

**Last updated:** 27 April 2026
**Status:** Active