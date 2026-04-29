const REVIEW_KEYWORDS = [
  'produk', 'barang', 'kualitas', 'ramah', 'cepat', 'bagus', 'mantap',
  'sesuai', 'recommended', 'terima', 'puas', 'pengiriman', 'penjual',
  'beli', 'pesan', 'pelayanan', 'packaging', 'packing', 'original',
  'worth', 'oke', 'nggak', 'tidak', 'sangat', 'banget', 'sekali',
  'suka', 'cocok', 'pas', 'murah', 'mahal', 'lagi', 'responsif',
];

const UI_SKIP = [
  /^(lihat|tampilkan|selengkapnya|semua ulasan|filter|urutkan|tulis ulasan|bagikan|share)/i,
  /^(beranda|profil|keranjang|pesanan|notifikasi|chat|pesan|inbox)/i,
  /^(shopee|tokopedia|instagram|google|lazada|bukalapak|gojek|grab)/i,
  /^(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/i,
  /^rp[\s\d.,]+$/i,
  /^\d[\d.,\s%★*]+$/,
  /^[\d\s,.★*%()]+$/,
  /^(rating|bintang|\d+(\.\d+)?\s*(\/\s*5|bintang|★))/i,
  /^(login|daftar|masuk|keluar|sign in|sign up)/i,
];

export function extractReviewsFromText(rawTexts) {
  const seen = new Set();

  return rawTexts
    .map(t => t.trim())
    .filter(t => t.length > 20)
    .filter(t => t.split(/\s+/).length >= 3)
    .filter(t => !UI_SKIP.some(p => p.test(t)))
    .filter(t => {
      const lower = t.toLowerCase();
      const hasKeyword = REVIEW_KEYWORDS.some(kw => lower.includes(kw));
      return hasKeyword || t.length > 50;
    })
    .filter(t => {
      const key = t.toLowerCase().replace(/\s+/g, ' ');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
