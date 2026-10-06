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
 *
 * @returns {Promise<JSX.Element>} The rendered layout container component
 *
 * @example
 * <LayoutContainer>
 *   <HomePage />
 * </LayoutContainer>
 */
export default async function LayoutContainer({ analytics = null, children, footerProps, jsonLd, menuProps, metadata = {}, navigation, preview }) {
  const theme = metadata.theme || 'system';
  const jsonLdMarkup = serializeJsonLd(await resolveJsonLd(jsonLd));

  return (
    <div className='bg-background text-foreground antialiased'>

      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--ds-z-max)] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-text focus:shadow-lg'
      >
        Skip to content
      </a>

      {/* Borealis wraps all content and provides the shared light/dark background treatment. */}
      <Borealis>
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
      </Borealis>

    </div>
  );
}
