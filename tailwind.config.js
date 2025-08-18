import { skeleton } from '@skeletonlabs/tw-plugin';
import { nailArtistTheme } from './src/lib/themes/nail-artist-theme.js';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
  ],
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
  plugins: [
    skeleton({
      themes: {
        preset: [
          {
            name: 'skeleton',
            enhancements: true,
          },
          {
            name: 'wintry',
            enhancements: true,
          },
          {
            name: 'modern',
            enhancements: true,
          },
          {
            name: 'rocket',
            enhancements: true,
          },
          {
            name: 'seafoam',
            enhancements: true,
          },
          {
            name: 'vintage',
            enhancements: true,
          },
          {
            name: 'sahara',
            enhancements: true,
          },
          {
            name: 'hamlindigo',
            enhancements: true,
          },
          {
            name: 'gold-nouveau',
            enhancements: true,
          },
          {
            name: 'crimson',
            enhancements: true,
          }
        ],
        custom: [
          nailArtistTheme
        ]
      }
    })
  ]
}
