/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── SignalDead Design System ────────────────────────────────
        'neon-cyan':    '#00E5FF',
        'amber':        '#FFB300',
        'crimson':      '#E63946',
        'console-grey': '#2D2E32',
        'cherry':       '#FF6B9D',

        // Semantic risk aliases
        'risk-safe':      '#00E5FF',
        'risk-degraded':  '#FFB300',
        'risk-high':      '#E63946',

        // Surface palette
        'surface-0':  '#0A0B0D',
        'surface-1':  '#111318',
        'surface-2':  '#191C22',
        'surface-3':  '#22262F',
        'border-dim': 'rgba(255,255,255,0.06)',
        'border-lit': 'rgba(0,229,255,0.25)',
      },
      fontFamily: {
        heading: ['Rajdhani', 'sans-serif'],
        body:    ['Space Grotesk', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'tele-xl':  ['4rem',  { lineHeight: '1', letterSpacing: '0.04em' }],
        'tele-lg':  ['2.5rem',{ lineHeight: '1', letterSpacing: '0.04em' }],
        'tele-md':  ['1.75rem',{ lineHeight: '1', letterSpacing: '0.04em' }],
      },
      boxShadow: {
        'glow-cyan':   '0 0 16px rgba(0,229,255,0.35), 0 0 32px rgba(0,229,255,0.15)',
        'glow-amber':  '0 0 16px rgba(255,179,0,0.35),  0 0 32px rgba(255,179,0,0.15)',
        'glow-crimson':'0 0 16px rgba(230,57,70,0.35),  0 0 32px rgba(230,57,70,0.15)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'grid-hud':
          'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
        'noise':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'grid-hud': '40px 40px',
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan':         'scan 4s linear infinite',
        'blink-cursor': 'blink 1s step-end infinite',
        'spin-slow':    'spin 3s linear infinite',
        'glitch':       'glitch 0.3s steps(2) infinite',   // architecture only
      },
      keyframes: {
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        glitch: {
          '0%':  { clipPath: 'inset(40% 0 61% 0)', transform: 'translate(-2px, 2px)' },
          '50%': { clipPath: 'inset(80% 0 1% 0)',  transform: 'translate(2px, -2px)' },
          '100%':{ clipPath: 'inset(25% 0 58% 0)', transform: 'translate(0)' },
        },
      },
    },
  },
  plugins: [],
}
