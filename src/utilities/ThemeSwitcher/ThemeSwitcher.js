'use client';

/**
 * ThemeSwitcher Component
 *
 * @description Theme toggle component that provides a button for switching between light and dark modes.
 * Features icon-based visual feedback and integrates with next-themes for consistent theme management.
 * Includes proper ARIA labeling for accessibility.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useTheme } from 'next-themes';

import { useIsClient } from '../../hooks/environment/use-is-client.js';

import Icon from '../../components/core/Icon';

/**
 * Internal provider component that renders the theme toggle button
 *
 * @description Core theme switcher logic that provides a clickable button with appropriate
 * icons (sun for light mode, moon for dark mode). Handles theme state management and
 * visual feedback for the current theme selection.
 *
 * @returns {JSX.Element} Theme toggle button with icon
 */
function Provider() {
  const { setTheme, theme } = useTheme();
  const mounted = useIsClient();

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) return (
    <button
      aria-label='Toggle Dark Mode'
      type='button'
      style={{ 'outline': 'none' }}
      className='inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-gray-950 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:text-gray-100 dark:hover:bg-gray-800'
    >
      <Icon name='SunFill' decorative className='h-5 w-5 lg:h-4 lg:w-4' />
    </button>
  );

  return (
    <button
      aria-label='Toggle Dark Mode'
      type='button'
      style={{ 'outline': 'none' }}
      className='inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-gray-950 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:text-gray-100 dark:hover:bg-gray-800'
      onClick={ () => setTheme(theme === 'dark' ? 'light' : 'dark') }
    >
      {theme === 'dark' ? <Icon name='MoonFill' decorative className='h-5 w-5 lg:h-4 lg:w-4' /> : <Icon name='SunFill' decorative className='h-5 w-5 lg:h-4 lg:w-4' />}
    </button>
  );
}

/**
 * Main theme switcher component
 *
 * @description Public component that consumes the shared app-level ThemeProvider.
 *
 * @returns {JSX.Element} Complete theme switcher with provider context
 *
 * @example
 * // Basic usage in navigation header
 * <ThemeSwitch />
 *
 * @example
 * // Used in navigation bar or header
 * <nav>
 *   <Logo />
 *   <NavigationLinks />
 *   <ThemeSwitch />
 * </nav>
 */
function ThemeSwitch() {
  return <Provider />;
}

export default ThemeSwitch;
