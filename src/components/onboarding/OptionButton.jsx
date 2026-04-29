import React from 'react';

export default function OptionButton({ label, icon, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left border-2 rounded-xl px-5 py-4
        text-body font-medium
        transition-all duration-200 active:scale-[0.99]
        ${selected
          ? 'border-brand bg-surface2 text-brand'
          : 'border-line bg-surface text-ink hover:border-sky hover:bg-canvas'
        }
      `}
    >
      <span className="flex items-center gap-3">
        {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
        <span className="flex-1">{label}</span>
        {selected && (
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </span>
    </button>
  );
}
