'use client';

/**
 * FloatingMenu Component
 *
 * @description Floating/sticky navigation component that appears and disappears based on scroll behavior.
 * This component provides quick access to main navigation links and a "scroll to top" button.
 * Features smooth animations, responsive design, and intelligent scroll-based visibility logic.
 * The menu appears when scrolling up and hides when scrolling down, with a minimum scroll threshold.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useRef, useState } from 'react';

import Button from '../../core/Button';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { cn } from '../../../utilities/cn';
import { useSiteConfig } from '../../../utilities/SiteConfig';
import styles from './FloatingMenu.module.css';

/**
 * Renders a floating navigation menu with scroll-based visibility
 *
 * @description Simple floating menu that tracks scroll position and direction to show/hide intelligently.
 * Displays main navigation links and a scroll-to-top button. Adapts its styling for both light and dark themes.
 * Mobile responsive with adjusted sizing and spacing.
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes to apply to the menu container
 *
 * @returns {JSX.Element} Floating navigation menu with scroll-based visibility
 *
 * @example
 * // Basic usage
 * <FloatingMenu />
 *
 * @example
 * // With custom styling
 * <FloatingMenu className="custom-floating-menu" />
 *
 * @example
 * // The menu automatically shows/hides based on scroll:
 * // - Hidden when at top of page
 * // - Shows when scrolling up
 * // - Hides when scrolling down
 */
const FloatingMenu = ({ className, links }) => {
  const { navigation } = useSiteConfig();
  const navLinks = links ?? navigation.links;
  const [ visible, setVisible ] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY < 50)
        setVisible(false);
      else if (currentScrollY < lastScrollY)
        setVisible(true);
      else if (currentScrollY > lastScrollY)
        setVisible(false);

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { 'passive': true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Scrolls the page to the top smoothly
   *
   * @description Handler function that smoothly scrolls the page to the top when the
   * "Back Top" button is clicked. Uses the native window.scrollTo method.
   *
   * @returns {void}
   */
  const handleScrollTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ 'behavior': reduceMotion ? 'auto' : 'smooth', 'top': 0 });
  };

  return (
    <div
      aria-hidden={ !visible }
      inert={ !visible }
      className={ cn(
        'fixed left-1/2 top-3 z-[var(--ds-z-nav)] flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center justify-center gap-3 overflow-x-auto rounded-control border border-white/10 bg-black py-1 pl-4 pr-1 text-white shadow-[var(--ds-shadow-floating)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none dark:border-black/10 dark:bg-white dark:text-black sm:gap-5 sm:pl-5', styles.menu, visible ? 'opacity-100 translate-y-0' : 'pointer-events-none -translate-y-full opacity-0', className
      ) }
    >
      {navLinks.map((navItem, idx) => (
        <Link key={ `link=${idx}` } href={ navItem.href } tabIndex={ visible ? undefined : -1 } className={ cn('relative flex min-h-10 shrink-0 items-center text-white hover:text-blue-400 dark:text-black dark:hover:text-blue-600') }>
          <span className='block text-xs font-medium sm:text-sm'>{navItem.title}</span>
        </Link>
      ))}
      <Button variant='outline' tone='neutral' size='xs' tabIndex={ visible ? undefined : -1 } onClick={ () => handleScrollTop() } className={ cn('relative h-10 min-h-10 shrink-0 gap-1.5 rounded-control border-white/35 px-3 py-1.5 text-xs font-medium text-white hover:border-white/50 hover:bg-white/10 hover:text-white dark:border-black/20 dark:text-black dark:hover:border-black/30 dark:hover:bg-black/[0.06] dark:hover:text-black sm:ml-1', styles.backToTop) } aria-label='Back to top'>
        <Icon name='ArrowUpCircle' size='sm' decorative />
        <span className='max-sm:hidden'>Back to top</span>
      </Button>
    </div>
  );
};

export default FloatingMenu;
