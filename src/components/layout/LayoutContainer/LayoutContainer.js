import { ThemeProvider } from 'next-themes';

import Borealis from '../../animations/Borealis/index.js';
import Footer from '../Footer';
import FloatingMenu from '../../core/FloatingMenu';
import Menu from '../../blocks/Navigation';
import { SiteConfigProvider } from '../../../context';

const resolveJsonLd = async (jsonLd) => {
  try {
    return typeof jsonLd === 'function' ? await jsonLd() : jsonLd;
  } catch {
    return null;
  }
};

const serializeJsonLd = (jsonLd) => {
  if (!jsonLd) return null;

  try {
    const serialized = JSON.stringify(jsonLd);

    return serialized ? serialized.replace(/</g, '\\u003c') : null;
  } catch {
    return null;
  }
};

/**
 * Main layout container component that wraps all page content
 *
 * @description Provides the foundational layout structure including theme management, background animations,
 * navigation components, an app-supplied analytics slot, and structured data. Gaudi loads no third-party
 * scripts itself: pass the app's analytics element (for example `<Analytics />` from `@vercel/analytics/react`)
 * through `analytics`. The component handles both light and dark
 * mode themes with appropriate background animations and overlays.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.analytics] - App-owned analytics element rendered inside the theme provider
 * @param {React.ReactNode} props.children - The page content to be rendered within the layout
 * @param {Object} [props.footerProps] - Footer navigation, social, and copyright data
 * @param {Object|Function} [props.jsonLd] - JSON-LD structured data (object, or function returning one)
 * @param {Object} [props.menuProps] - Navigation and command launcher content data
 * @param {Object} [props.metadata] - Site metadata (author, title, locale, theme, …)
 * @param {Object} [props.navigation] - Navigation data (links, categoriesMetadata)
 * @param {Object} [props.preview] - Link preview settings forwarded to SiteConfigProvider ({ endpoint, resolveImage })
 * @param {React.ReactNode} [props.background] - Decorative full-width layer at the top of the page that scrolls with it and sets its own height, such as an animated band; replaces the default Borealis
 *
 * @returns {Promise<JSX.Element>} The rendered layout container component
 *
 * @example
 * <LayoutContainer>
 *   <HomePage />
 * </LayoutContainer>
 */
export default async function LayoutContainer({ analytics = null, background, children, footerProps, jsonLd, menuProps, metadata = {}, navigation, preview }) {
  const theme = metadata.theme || 'system';
  const jsonLdMarkup = serializeJsonLd(await resolveJsonLd(jsonLd));

  const page = (
      <ThemeProvider attribute='class' defaultTheme={ theme } enableSystem disableTransitionOnChange>
        {analytics}

        <SiteConfigProvider metadata={ metadata } navigation={ navigation } preview={ preview }>
          <div className='relative w-full sm:w-[95%] xl:w-[90%] isolate xl:max-w-6xl px-4 sm:px-8 dark:z-10'>
            <div className='flex min-h-dvh flex-col'>
              <FloatingMenu/>
              <Menu { ...menuProps } />
              {jsonLdMarkup ? <script type='application/ld+json' dangerouslySetInnerHTML={{ '__html': jsonLdMarkup }} key='jsonld'/> : null}
              <main id='main-content' className='mb-4 mt-4 flex-1 lg:mt-6'>{children}</main>
              <Footer { ...footerProps } />
            </div>
          </div>
        </SiteConfigProvider>
      </ThemeProvider>
  );

  return (
    <div className='bg-background text-foreground antialiased'>

      <a className='ds-skip-link' href='#main-content'>Skip to content</a>

      {background ? (
        <>
          {/* A full-width layer at the top of the page that scrolls with it; it sets its own height. Positioned before the content so the content paints above it. */}
          <div aria-hidden='true' data-slot='layout-background' className='absolute inset-x-0 top-0'>{background}</div>
          {/* The same centred column Borealis provides. */}
          <div className='relative isolate flex min-h-dvh flex-col items-center'>{page}</div>
        </>
      ) : (
        // Keep even subtle reading text legible at the animation's brightest point.
        <Borealis intensity={0.02}>{page}</Borealis>
      )}

    </div>
  );
}
