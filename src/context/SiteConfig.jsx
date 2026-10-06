'use client';

// Consumer-owned site data, with safe defaults for isolated components.
import { createContext, useContext, useMemo } from 'react';

export const defaultSiteConfig = {
  'metadata': {
    'author': { 'name': '' },
    'description': '',
    'email': '',
    'locale': 'en-US',
    'theme': 'system',
    'title': ''
  },
  'navigation': {
    'categoriesMetadata': {},
    'links': []
  },
  // App-owned link preview settings. Gaudi loads nothing by default: without an
  // `endpoint` LinkPreview fetches nothing, and without `resolveImage` it derives no images.
  'preview': {
    'endpoint': null,
    'resolveImage': null
  }
};

const SiteConfigContext = createContext(defaultSiteConfig);

/**
 * Provides site metadata and navigation data to all descendant components
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Descendant tree that reads the config
 * @param {Object} [props.metadata] - Site metadata (author, title, locale, theme, …)
 * @param {Object} [props.navigation] - Navigation data (links, categoriesMetadata)
 * @param {Object} [props.preview] - Link preview settings ({ endpoint: string | (url) => string | null, resolveImage: function or template map, see LinkPreview })
 *
 * @returns {JSX.Element} Context provider wrapping children
 *
 * @example
 * <SiteConfigProvider metadata={ siteMetadata } navigation={ navigationMetadata }>
 *   <App />
 * </SiteConfigProvider>
 */
export function SiteConfigProvider({ children, metadata, navigation, preview }) {
  const value = useMemo(() => ({
    'metadata': { ...defaultSiteConfig.metadata, ...metadata },
    'navigation': { ...defaultSiteConfig.navigation, ...navigation },
    'preview': { ...defaultSiteConfig.preview, ...preview }
  }), [ metadata, navigation, preview ]);

  return <SiteConfigContext.Provider value={ value }>{children}</SiteConfigContext.Provider>;
}

/**
 * Reads the current site configuration
 *
 * @returns {{ metadata: Object, navigation: Object, preview: Object }} The active site config, or defaults
 */
export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
