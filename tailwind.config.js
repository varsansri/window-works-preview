export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        linen: '#FBF9F5',
        sand: '#F5F1E9',
        soft: '#EFE9DD',
        navy: '#081C45',
        regal: '#0B2559',
        midnight: '#05112B',
        muted: '#4F5F78',
        rule: '#E5DCCE',
        gold: '#D4AF37',
        brass: '#C59B63',
        'gold-ink': '#7D5F22',
        'gold-light': '#F2D888',
        brand: '#134AA2',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
