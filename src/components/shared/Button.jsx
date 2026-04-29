import React from 'react';

const VARIANTS = {
  primary:   'bg-brand text-white hover:bg-brand/90',
  secondary: 'bg-surface border-2 border-navy text-navy hover:bg-surface2',
  ghost:     'bg-transparent text-ink2 hover:text-ink hover:bg-surface2',
  danger:    'bg-danger text-white hover:bg-danger/90',
};

const SIZES = {
  sm:   'px-4 py-2 text-label',
  md:   'px-6 py-3 text-label',
  lg:   'px-8 py-3.5 text-small',
  full: 'w-full px-6 py-3.5 text-small',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl ' +
    'transition-all duration-200 active:scale-[0.98] ' +
    'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2';
  const disabledCls = 'opacity-40 cursor-not-allowed pointer-events-none';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size]} ${disabled || loading ? disabledCls : ''} ${className}`}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
