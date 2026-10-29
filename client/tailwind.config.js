export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#051F20', card: '#0B2B26', card2: '#163832', line: '#235347',
        accent: '#4ADE9A', gold: '#F2C46D', danger: '#F87171',
        ink: '#DAF1DE', body: '#B7D4BF', muted: '#8EB69B',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
