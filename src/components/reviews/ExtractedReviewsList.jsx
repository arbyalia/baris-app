import React from 'react';

export default function ExtractedReviewsList({ reviews, onDelete }) {
  if (reviews.length === 0) return null;

  return (
    <div className="space-y-2">
      {reviews.map((review, i) => (
        <div key={review.id} className="bg-surface border border-line rounded-xl px-3 py-2.5 relative">
          <div className="flex items-start gap-2 pr-6">
            <span className="text-label font-bold text-brand flex-shrink-0 mt-0.5">#{i + 1}</span>
            <p className="text-small text-ink leading-snug">{review.text}</p>
          </div>
          <button
            onClick={() => onDelete(review.id)}
            className="absolute top-2 right-2 w-5 h-5 rounded text-ink3 hover:text-danger
              hover:bg-danger-bg flex items-center justify-center transition-colors text-xs font-bold"
            title="Hapus"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
