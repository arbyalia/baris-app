import axios from 'axios';

/**
 * Kirim array ulasan ke Azure AI Language untuk analisis sentimen.
 * Return: array of { id, sentiment, confidenceScores: { positive, neutral, negative } }
 */
export async function analyzeSentiment(reviews) {
  const endpoint = process.env.REACT_APP_AZURE_LANGUAGE_ENDPOINT;
  const key = process.env.REACT_APP_AZURE_LANGUAGE_KEY;

  if (!endpoint || !key) {
    throw new Error(
      'Konfigurasi layanan AI belum lengkap. Pastikan file .env sudah diisi dengan benar.'
    );
  }

  const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

  const body = {
    kind: 'SentimentAnalysis',
    analysisInput: {
      documents: reviews.map((text, i) => ({
        id: String(i + 1),
        language: 'id',
        text,
      })),
    },
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    const documents = response.data?.results?.documents;
    if (!Array.isArray(documents)) {
      throw new Error('Layanan AI mengembalikan format yang tidak dikenali. Coba lagi.');
    }

    return documents.map((doc) => ({
      id: doc.id,
      sentiment: doc.sentiment,           // 'positive' | 'neutral' | 'negative' | 'mixed'
      confidenceScores: {
        positive: doc.confidenceScores?.positive ?? 0,
        neutral: doc.confidenceScores?.neutral ?? 0,
        negative: doc.confidenceScores?.negative ?? 0,
      },
    }));
  } catch (err) {
    // Jangan expose detail teknis ke user
    if (err.response) {
      const status = err.response.status;
      if (status === 401 || status === 403) {
        throw new Error('Akses ke layanan AI ditolak. Silakan hubungi pengelola aplikasi.');
      }
      if (status === 429) {
        throw new Error('Terlalu banyak permintaan sekaligus. Tunggu sebentar, lalu coba lagi.');
      }
      if (status >= 500) {
        throw new Error('Layanan AI sedang mengalami gangguan. Coba beberapa saat lagi.');
      }
    }
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      throw new Error('Koneksi ke layanan AI timeout. Periksa koneksi internet Anda.');
    }
    if (err.message === 'Network Error') {
      throw new Error('Tidak ada koneksi internet. Pastikan Anda terhubung, lalu coba lagi.');
    }
    // Jika sudah berupa pesan user-friendly (dari throw di atas), teruskan
    if (err.message && !err.response) throw err;
    throw new Error('Gagal menganalisis ulasan. Silakan coba lagi.');
  }
}
