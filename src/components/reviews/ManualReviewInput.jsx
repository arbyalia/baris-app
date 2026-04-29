import React, { useState } from 'react';

export default function ManualReviewInput({ onAdd, disabled }) {
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState('');

  const handleAdd = () => {
    const trimmed = text.trim();
    if (trimmed.length < 10) return;
    onAdd(trimmed);
    setText('');
    setShowInput(false);
  };

  const handleCancel = () => {
    setText('');
    setShowInput(false);
  };

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        disabled={disabled}
        className="w-full text-ink2 font-medium px-4 py-3 rounded-xl text-label
          hover:bg-surface2 hover:text-ink transition-all duration-200
          border border-dashed border-line disabled:opacity-40 disabled:cursor-not-allowed"
      >
        + Tambah ulasan
      </button>
    );
  }

  return (
    <div className="bg-surface border border-line rounded-2xl p-4 space-y-3">
      <p className="text-label font-semibold text-ink">Ketik atau paste ulasan:</p>
      <textarea
        autoFocus
        rows={3}
        placeholder="Tempel ulasan pelanggan di sini..."
        className="w-full bg-canvas border border-line rounded-xl px-3 py-2 text-small text-ink
          resize-none focus:outline-none focus:ring-2 focus:ring-brand transition-colors"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleAdd(); }}
      />
      {text.length > 0 && text.trim().length < 10 && (
        <p className="text-micro text-danger">Minimal 10 karakter.</p>
      )}
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleCancel}
          className="text-ink2 px-4 py-2 rounded-xl text-label font-medium hover:bg-surface2 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={handleAdd}
          disabled={text.trim().length < 10}
          className="bg-brand text-white px-4 py-2 rounded-xl text-label font-semibold
            hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Tambah
        </button>
      </div>
    </div>
  );
}
