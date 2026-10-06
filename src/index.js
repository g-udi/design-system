/*
 * MDX components are intentionally NOT re-exported here: they pull heavy peer
 * dependencies (recharts, framer-motion, katex, mermaid) that most
 * consumers never need. Import them from '@gaudi/design-system/mdx' instead,
 * and the compiled-MDX runtime from '@gaudi/design-system/mdx/runtime'.
 */
export * from './components/blocks';
export * from './components/chat';
export * from './components/core';
export * from './components/layout';
export * from './components/post';
export * from './hooks';
export { default as Typography, typographyVariants } from './foundations/Typography';
export { getIcon, iconColors, iconLabels, iconRegistry, iconSizes } from './icons';
export { colors, motion, radii, shadows, tokens, typography } from './tokens';
export { applyTheme, getThemePreset, getThemeScript, listThemes, themePresets, ThemeProvider, useTheme } from './themes';
export { cn } from './utilities/cn';
export { coreContent, omit, pick, sortPosts } from './utilities/content';
export { createVariants } from './utilities/variants';
export { default as formatDate } from './utilities/formatDate';
export { defaultSiteConfig, SiteConfigProvider, useSiteConfig, InputConfigProvider } from './context';

export * from './components/animations';
