import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './sections/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          /** Celeste tecnológico — inspirado PowerShell / Azure */
          cyan: '#3BC9F4',
          sky: '#5CC8FF',
          electric: '#2B9FFF',
          blue: '#1B8CFF',
          azure: '#0078D4',
          /** Azules profundos elegantes */
          deep: '#071A32',
          navy: '#0B2342',
          panel: '#0F2E52',
          /** Neutros iluminados */
          soft: '#E8F4FC',
          mist: '#B8D4E8',
          slate: '#7B9BB8',
          /** Dorado premium */
          gold: '#D4AF37',
          'gold-light': '#F0D78C',
          'gold-dark': '#B8922A',
          /** Legado — evitar morado en UI nueva */
          purple: '#3B82F6',
          green: '#10B981',
          charcoal: '#1E3A5F',
          dark: '#0A2340',
          darker: '#061528',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 201, 244, 0.35), transparent)',
        'card-gradient':
          'linear-gradient(135deg, rgba(59, 201, 244, 0.12) 0%, rgba(27, 140, 255, 0.08) 100%)',
        'app-gradient':
          'linear-gradient(165deg, #0a2340 0%, #0f3058 45%, #0c2848 100%)',
        'sidebar-gradient':
          'linear-gradient(180deg, #061528 0%, #0b2342 50%, #0a1f3a 100%)',
        'premium-gradient':
          'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(59, 201, 244, 0.1) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(59, 201, 244, 0.35)',
        'glow-cyan': '0 0 32px rgba(91, 200, 255, 0.4)',
        'glow-blue': '0 0 40px rgba(27, 140, 255, 0.3)',
        'glow-gold': '0 0 28px rgba(212, 175, 55, 0.35)',
        'glow-purple': '0 0 40px rgba(27, 140, 255, 0.25)',
        'glow-green': '0 0 40px rgba(16, 185, 129, 0.3)',
        card: '0 4px 24px rgba(7, 26, 50, 0.4), 0 0 1px rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
