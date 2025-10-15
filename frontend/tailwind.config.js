export default {
  // No content array needed in v4 as it's automatically detected
  theme: {
    extend: {
      fontFamily: {
        'anton': ['Anton', 'sans-serif'],
        'garamond': ['EB Garamond', 'Cormorant Garamond', 'serif'],
      },
      colors: {
        'tradey-red': 'var(--color-tradey-red)',
        'tradey-blue': 'var(--color-tradey-blue)',
        'tradey-black': 'var(--color-tradey-black)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
} 