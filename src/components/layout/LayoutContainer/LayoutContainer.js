/**
 * Layout Container Component
 *
 * @description The main layout wrapper component that provides the overall structure and visual design for all pages.
 * It includes the Aurora background animation, theme provider, navigation components, analytics, and structured data.
 * This component serves as the root layout for the entire application.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { Analytics } from '@vercel/analytics/react';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';

import Aurora from '../Aurora';
import Footer from '../Footer';
import FloatingMenu from '../../core/FloatingMenu';
import Menu from '../../blocks/Navigation';
import { SiteConfigProvider } from '../../../utilities/SiteConfig';

const ThemeProvider = dynamic(() => import('../../../utilities/ThemeProvider'));

const getThemeCookieStore = async () => {
  try {
    return await cookies();
  } catch {
    return null;
  }
};

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
 * navigation components, analytics integration, and structured data. The component handles both light and dark
 * mode themes with appropriate background animations and overlays.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The page content to be rendered within the layout
 * @param {Object} [props.footerProps] - Footer navigation, social, and copyright data
 * @param {Object|Function} [props.jsonLd] - JSON-LD structured data (object, or function returning one)
 * @param {Object} [props.menuProps] - Navigation and command launcher content data
 * @param {Object} [props.metadata] - Site metadata (author, title, locale, theme, …)
 * @param {Object} [props.navigation] - Navigation data (links, categoriesMetadata)
 *
 * @returns {Promise<JSX.Element>} The rendered layout container component
 *
 * @example
 * <LayoutContainer>
 *   <HomePage />
 * </LayoutContainer>
 */
export default async function LayoutContainer({ children, footerProps, jsonLd, menuProps, metadata = {}, navigation }) {
  const themeCookie = await getThemeCookieStore();
  const theme = themeCookie?.get('__theme__')?.value || metadata.theme || 'system';
  const jsonLdMarkup = serializeJsonLd(await resolveJsonLd(jsonLd));

  return (
    <div className='bg-background text-foreground antialiased'>

      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--ds-z-max)] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-text focus:shadow-lg'
      >
        Skip to content
      </a>

      {/* Aurora wraps all content and provides the shared light/dark background treatment. */}
      <Aurora>
        <ThemeProvider attribute='class' defaultTheme={ theme } enableSystem disableTransitionOnChange>
          <Analytics />

          <SiteConfigProvider metadata={ metadata } navigation={ navigation }>
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
      </Aurora>

    </div>
  );
}
