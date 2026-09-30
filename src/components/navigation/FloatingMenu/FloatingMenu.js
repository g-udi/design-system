'use client';

/**
 * FloatingMenu Component
 *
 * @description An inverted pill of site links plus Back to top that slides in when the reader scrolls
 * back up past 50px and hides again on the way down.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

import { useEffect, useRef, useState } from 'react';

import Button from '../../core/Button';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { cn } from '../../../utilities/cn';
import { useSiteConfig } from '../../../utilities/SiteConfig';

/**
 * Renders the scroll-aware quick navigation
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Extra classes for the pill
 * @param {Array<{ href: string, title: string }>} [props.links] - Destinations; defaults to SiteConfig `navigation.links`
 *
 * @returns {JSX.Element} The floating navigation
 *
 * @example
 * <FloatingMenu links={[{ href: '/blog', title: 'Blog' }]} />
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

  // Honour reduced motion when jumping back to the top.
  const handleScrollTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ 'behavior': reduceMotion ? 'auto' : 'smooth', 'top': 0 });
  };

  return (
    <nav
      aria-label='Quick navigation'
      aria-hidden={ !visible }
      inert={ !visible }
      className={ cn(
        'fixed left-1/2 top-3 z-[var(--ds-z-nav)] flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center justify-center gap-3 overflow-x-auto rounded-control bg-text py-1 pl-4 pr-1 text-surface shadow-[var(--ds-shadow-floating)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none sm:gap-5 sm:pl-5 max-[1100px]:px-4 sm:max-[1100px]:px-5',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0',
        className
      ) }
    >
      {navLinks.map((navItem) => (
        <Link key={ navItem.href } href={ navItem.href } variant='bare' tabIndex={ visible ? undefined : -1 } className='flex min-h-10 shrink-0 items-center text-xs font-medium hover:opacity-75 sm:text-sm'>
          {navItem.title}
        </Link>
      ))}
      <Button
        variant='outline'
        tone='neutral'
        size='xs'
        tabIndex={ visible ? undefined : -1 }
        onClick={ handleScrollTop }
        className='h-10 shrink-0 gap-1.5 rounded-control border-surface/35 px-3 text-surface hover:border-surface/50 hover:bg-surface/10 sm:ml-1 max-[1100px]:hidden'
        aria-label='Back to top'
      >
        <Icon name='ArrowUpCircle' size='sm' decorative />
        <span className='max-sm:hidden'>Back to top</span>
      </Button>
    </nav>
  );
};

export default FloatingMenu;
