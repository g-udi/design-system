const { colors, radii, typography } = require('./src/tokens/tokens.cjs');

/**
 * Prose typography for the `@tailwindcss/typography` plugin, expressed via the
 * `--ds-prose-*` custom properties declared in `src/styles.css` so consumers
 * can retheme prose without regenerating CSS.
 */
const proseCss = {
  fontSize: 'var(--ds-prose-font-size)',
  h1: {
    marginBottom: 'var(--ds-prose-h1-margin-bottom)',
    marginTop: 'var(--ds-prose-h1-margin-top)'
  },
  h2: {
    marginBottom: 'var(--ds-prose-h2-margin-bottom)',
    marginTop: 'var(--ds-prose-h2-margin-top)'
  },
  h3: {
    marginBottom: 'var(--ds-prose-h3-margin-bottom)',
    marginTop: 'var(--ds-prose-h3-margin-top)'
  },
  h4: {
    marginBottom: 'var(--ds-prose-h4-margin-bottom)',
    marginTop: 'var(--ds-prose-h4-margin-top)'
  },
  lineHeight: 'var(--ds-line-height-prose)',
  maxWidth: 'var(--ds-prose-max-width)'
};

module.exports = {
  theme: {
    // Keep variable references so changing --ds-radius rethemes compiled utilities.
    // Full is reserved for
    // intrinsic circles such as avatars, radio indicators, and status dots.
    borderRadius: {
      none: '0px',
      DEFAULT: radii.control,
      xs: radii.sm,
      sm: radii.sm,
      md: radii.control,
      lg: radii.card,
      xl: radii.card,
      '2xl': radii.card,
      '3xl': radii.card,
      '4xl': radii.card,
      ...radii,
      full: '9999px'
    },
    extend: {
      animation: {
        aurora: 'aurora 60s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        shimmer: 'shimmer 2.5s ease-in-out infinite'
      },
      colors,
      fontFamily: typography.fontFamily,
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%'
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%'
          }
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      lineHeight: {
        relaxed: '1.7'
      },
      typography: {
        DEFAULT: {
          css: proseCss
        }
      }
    }
  }
};
