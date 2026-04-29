/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas:       '#F0F5FF',
        surface:      '#FFFFFF',
        surface2:     '#E8F0FD',
        navy:         '#1A3A6B',
        brand:        '#2563EB',
        sky:          '#4A7FC1',
        ink:          '#0F172A',
        ink2:         '#475569',
        ink3:         '#94A3B8',
        line:         '#E2E8F0',
        success:      '#16A34A',
        'success-bg': '#DCFCE7',
        warning:      '#CA8A04',
        'warning-bg': '#FEF9C3',
        danger:       '#DC2626',
        'danger-bg':  '#FEE2E2',
      },
      fontSize: {
        'score': ['3.5rem',   { lineHeight: '1',    fontWeight: '700', letterSpacing: '-0.02em' }],
        'h1':    ['2rem',     { lineHeight: '1.2',  fontWeight: '700', letterSpacing: '-0.02em' }],
        'h2':    ['1.5rem',   { lineHeight: '1.3',  fontWeight: '700', letterSpacing: '-0.01em' }],
        'h3':    ['1.125rem', { lineHeight: '1.4',  fontWeight: '600' }],
        'body':  ['1rem',     { lineHeight: '1.65', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.5',  fontWeight: '400' }],
        'label': ['0.8125rem',{ lineHeight: '1.4',  fontWeight: '600', letterSpacing: '0.01em' }],
        'micro': ['0.6875rem',{ lineHeight: '1.4',  fontWeight: '500', letterSpacing: '0.06em' }],
      },
    },
  },
  plugins: [],
}
