/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '0.8' }
        }
      },
      animation: {
        slideIn: 'slideIn 0.5s ease-out',
        slideOut: 'slideOut 0.5s ease-in',
        float: 'float 3s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite'
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        nailArtist: {
          "primary": "#8b5cf6", // vibrant purple
          "secondary": "#ec4899", // hot pink
          "accent": "#06b6d4", // cyan
          "neutral": "#1f2937", // dark gray
          "base-100": "#111827", // very dark gray
          "base-200": "#1f2937", // dark gray
          "base-300": "#374151", // medium gray
          "info": "#06b6d4",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        }
      }
    ]
  }
}
