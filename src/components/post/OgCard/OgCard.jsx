/**
 * Open Graph card
 *
 * @description A social preview image template for `next/og` (`ImageResponse`) and other Satori
 * renderers. It uses only inline styles and flex layout (every element with several children is a
 * flex container), no DOM-only components, no Tailwind classes and no network requests, so it also
 * renders as ordinary markup for previews. Fonts come from the renderer: pass them in the
 * `ImageResponse` options; without them the renderer's default face is used.
 *
 * @param {Object} props - Component props
 * @param {string} [props.category] - Short label above the title, such as the post category
 * @param {number} [props.height=630] - Image height in pixels
 * @param {React.ReactNode} [props.logo] - Mark in the top corner: an inline <svg> or an <img> with a data URL
 * @param {string} [props.siteName] - Site name or URL along the bottom edge
 * @param {string} [props.subtitle] - Supporting line below the title
 * @param {'light'|'dark'} [props.theme='light'] - Neutral light or dark palette
 * @param {string} props.title - The page or post title
 * @param {number} [props.width=1200] - Image width in pixels
 *
 * @example
 * // app/api/og/route.js
 * import { ImageResponse } from 'next/og';
 * import { OgCard, ogImageSize } from '@gaudi/design-system/post/OgCard';
 *
 * export function GET() {
 *   return new ImageResponse(<OgCard title='Notes on local-first software' category='Engineering' siteName='example.com' />, ogImageSize);
 * }
 */

/** The recommended Open Graph image size. Pass it to `ImageResponse` with the card's defaults. */
export const ogImageSize = Object.freeze({ width: 1200, height: 630 });

// Neutral palettes with AA contrast for every text role; the bottom rule carries the only accent.
const palettes = {
  dark: { background: '#171717', title: '#fafafa', text: '#d4d4d4', subtle: '#a3a3a3', rule: '#fafafa' },
  light: { background: '#ffffff', title: '#171717', text: '#404040', subtle: '#525252', rule: '#171717' }
};

// Long titles step down so up to three lines fit beside the logo.
const titleSize = (title = '') => (title.length > 90 ? 48 : title.length > 50 ? 56 : 68);

export function OgCard({ category, height = ogImageSize.height, logo, siteName, subtitle, theme = 'light', title, width = ogImageSize.width }) {
  const palette = palettes[theme] || palettes.light;

  return (
    <div
      data-slot='og-card'
      style={ {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width,
        height,
        padding: '64px 80px',
        boxSizing: 'border-box',
        background: palette.background,
        borderBottom: `16px solid ${palette.rule}`,
        color: palette.text
      } }
    >
      <div style={ { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 48 } }>
        <div style={ { display: 'flex', fontSize: 24, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', color: palette.subtle } }>{category || ''}</div>
        {logo ? <div style={ { display: 'flex', width: 120, height: 120, flexShrink: 0, color: palette.title } }>{logo}</div> : null}
      </div>

      <div style={ { display: 'flex', flexDirection: 'column', gap: 24 } }>
        <div style={ { display: 'flex', fontSize: titleSize(title), fontWeight: 700, lineHeight: 1.12, letterSpacing: -1.5, color: palette.title } }>{title}</div>
        {subtitle ? <div style={ { display: 'flex', fontSize: 30, lineHeight: 1.4, color: palette.text } }>{subtitle}</div> : null}
      </div>

      <div style={ { display: 'flex', fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: palette.subtle } }>{siteName || ''}</div>
    </div>
  );
}

export default OgCard;
