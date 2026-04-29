import React from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import PDFTemplate from '../components/report/PDFTemplate';

export async function generatePDF(data) {
  // Container tersembunyi di luar viewport
  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;top:-30000px;left:0;width:794px;z-index:-9999;background:#ffffff;';
  document.body.appendChild(container);

  const root = createRoot(container);

  try {
    await new Promise((resolve, reject) => {
      root.render(
        React.createElement(PDFTemplate, {
          data,
          onReady: async () => {
            try {
              const canvas = await html2canvas(container.firstChild, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 794,
              });

              const imgData = canvas.toDataURL('image/jpeg', 0.92);

              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
              });

              const pdfW = pdf.internal.pageSize.getWidth();   // ~210mm
              const pdfH = pdf.internal.pageSize.getHeight();  // ~297mm

              // Hitung tinggi gambar dalam mm (proporsional dengan lebar A4)
              const imgHeightMm = (canvas.height / canvas.width) * pdfW;

              let remaining = imgHeightMm;
              let offsetY = 0;

              // Halaman pertama
              pdf.addImage(imgData, 'JPEG', 0, offsetY, pdfW, imgHeightMm);
              remaining -= pdfH;

              // Halaman berikutnya jika konten melebihi 1 halaman
              while (remaining > 1) {
                offsetY -= pdfH;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, offsetY, pdfW, imgHeightMm);
                remaining -= pdfH;
              }

              // Nama file: sanitize nama usaha
              const rawName = data.answers?.businessName || 'Usaha';
              const safeName = rawName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').slice(0, 25) || 'Usaha';
              const d = new Date();
              const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

              pdf.save(`BARIS-Laporan-${safeName}-${dateStr}.pdf`);
              resolve();
            } catch (err) {
              reject(new Error('Gagal membuat PDF. Coba lagi dalam beberapa saat.'));
            }
          },
        })
      );
    });
  } finally {
    try {
      root.unmount();
    } catch (_) {
      // ignore unmount errors
    }
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
