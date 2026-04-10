/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sw: {
          navy:    '#1B3D6F',
          teal:    '#009CA6',
          tealDark:'#007A82',
          purple:  '#6B2D8B',
          gold:    '#F5A623',
          bg:      '#F4F6F8',
          card:    '#FFFFFF',
          border:  '#E2E6EA',
          muted:   '#6B7280',
          light:   '#EBF7F8',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out both',
        'slide-up': 'slideUp 0.25s ease-out both',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
