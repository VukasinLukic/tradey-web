export default {
  // No content array needed in v4 as it's automatically detected
  theme: {
    extend: {
      fontFamily: {
        'anton': ['FaytePixelTest-Hard', 'sans-serif'],
        'garamond': ['Avara-Bold', 'sans-serif'],
        'fayte': ['FaytePixelTest-Hard', 'sans-serif'],
        'avarabold': ['Avara-Bold', 'sans-serif'],
      },
      colors: {
        'tradey-red': 'var(--color-tradey-red)',
        'tradey-blue': 'var(--color-tradey-blue)',
        'tradey-white': 'var(--color-tradey-white)',
        'tradey-black': 'var(--color-tradey-black)',
      },
      translate: {
        '101': '101%',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          'from': { transform: 'translateX(0%)' },
          'to': { transform: 'translateX(-50%)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'marquee': 'marquee 15s linear infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
      },
    },
  },
} 