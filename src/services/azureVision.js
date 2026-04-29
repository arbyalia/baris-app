const ENDPOINT = (process.env.REACT_APP_AZURE_VISION_ENDPOINT || '').replace(/\/$/, '');
const KEY = process.env.REACT_APP_AZURE_VISION_KEY;

export async function extractTextFromImage(file) {
  if (!ENDPOINT || !KEY) {
    throw new Error('Konfigurasi Azure Computer Vision belum lengkap. Periksa file .env');
  }

  const arrayBuffer = await file.arrayBuffer();

  const url = `${ENDPOINT}/computervision/imageanalysis:analyze?api-version=2023-10-01&features=read&language=id`;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': KEY,
        'Content-Type': 'application/octet-stream',
      },
      body: arrayBuffer,
    });
  } catch {
    throw new Error('Tidak ada koneksi internet. Pastikan Anda terhubung, lalu coba lagi.');
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || `HTTP ${response.status}`;
    if (response.status === 401 || response.status === 403) {
      throw new Error('Akses ke Azure Computer Vision ditolak. Hubungi pengelola aplikasi.');
    }
    if (response.status === 429) {
      throw new Error('Terlalu banyak permintaan sekaligus. Tunggu sebentar, lalu coba lagi.');
    }
    if (response.status >= 500) {
      throw new Error('Layanan Azure sedang gangguan. Coba beberapa saat lagi.');
    }
    throw new Error(`Gagal membaca gambar: ${msg}`);
  }

  const data = await response.json();

  const lines = [];
  for (const block of (data?.readResult?.blocks || [])) {
    for (const line of (block.lines || [])) {
      if (line.text?.trim()) lines.push(line.text.trim());
    }
  }

  return lines;
}
