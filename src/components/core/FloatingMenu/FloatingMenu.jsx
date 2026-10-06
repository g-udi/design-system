'use client';

/**
 * FloatingMenu
 *
 * @description A compact, inverted pill of destinations that floats over the top of the page once the
 * reader has scrolled away from the header. By default it appears when the reader scrolls back up past
 * `threshold` and hides on the way down; `revealOn='scroll'` keeps it visible past the threshold. It is
 * always a labelled navigation landmark in the tab order: focusing a link reveals it, so keyboard users
 * can reach it wherever they are on the page.
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import Button from '../Button';
import Icon from '../Icon';
import Link from '../Link';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { useScrollPosition } from '../../../hooks/layout/use-scroll-position.js';
import { cn } from '../../../utilities/cn';
import { useSiteConfig } from '../../../context';

const trimSlash = (href) => (href.length > 1 ? href.replace(/\/$/, '') : href);
const matchesPath = (href, path) => Boolean(path) && (trimSlash(path) === trimSlash(href) || (href !== '/' && path.startsWith(`${trimSlash(href)}/`)));
// The most specific matching destination is the current page (/blog/projects wins over /blog).
const currentHref = (items, path) => items
  .filter((item) => matchesPath(item.href, path))
  .reduce((best, item) => (trimSlash(item.href).length > trimSlash(best ?? '').length ? item.href : best), undefined);

/**
 * Next to the scroll offset, decides whether the pill shows. Past the threshold, `scroll-up` shows it
 * only while the reader moves back up; `scroll` shows it whenever the threshold is passed.
 */
const useReveal = ({ revealOn, targetRef, threshold }) => {
  const offset = useScrollPosition({ targetRef });
  const lastOffsetRef = useRef(0);
  const [ revealed, setRevealed ] = useState(false);

  useEffect(() => {
    const lastOffset = lastOffsetRef.current;
    lastOffsetRef.current = offset;

    if (offset < threshold) setRevealed(false);
    else if (revealOn === 'scroll') setRevealed(true);
    else if (offset < lastOffset) setRevealed(true);
    else if (offset > lastOffset) setRevealed(false);
  }, [ offset, revealOn, threshold ]);

  return revealed;
};

/**
 * Renders the scroll-revealed floating navigation
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.actions] - Extra controls after the links, such as a call to action
 * @param {boolean} [props.backToTop=true] - Show the Back to top button
 * @param {string} [props.className] - Extra classes for the pill
 * @param {string} [props.currentPath] - Path used for aria-current; defaults to the Next.js pathname
 * @param {string} [props.label='Quick navigation'] - Accessible name of the navigation landmark
 * @param {Array<{ href: string, title: React.ReactNode, active?: boolean }>} [props.links] - Destinations; defaults to SiteConfig `navigation.links`
 * @param {'fixed' | 'sticky'} [props.position='fixed'] - `fixed` floats over the viewport; `sticky` pins it to the top of a scroll container
 * @param {'scroll-up' | 'scroll'} [props.revealOn='scroll-up'] - When the pill shows past the threshold
 * @param {{ current: HTMLElement | null }} [props.targetRef] - Scroll container to observe instead of the window
 * @param {number} [props.threshold=50] - Scroll offset in pixels before the pill can show
 * @returns {JSX.Element} The floating navigation
 *
 * @example
 * <FloatingMenu links={[{ href: '/blog', title: 'Blog' }, { href: '/about', title: 'About' }]} />
 */
const FloatingMenu = ({
  actions,
  backToTop = true,
  className,
  currentPath,
  label = 'Quick navigation',
  links,
  position = 'fixed',
  revealOn = 'scroll-up',
  targetRef,
  threshold = 50
}) => {
  const { navigation } = useSiteConfig();
  const pathname = usePathname();
  const path = currentPath ?? pathname;
  const items = links ?? navigation?.links ?? [];
  const reduceMotion = usePrefersReducedMotion();
  const scrolledIntoView = useReveal({ revealOn, targetRef, threshold });
  const [ focused, setFocused ] = useState(false);
  const visible = scrolledIntoView || focused;
  const activeHref = currentHref(items, path);

  const scrollToTop = () => {
    const target = targetRef?.current || window;

    target.scrollTo({ 'behavior': reduceMotion ? 'auto' : 'smooth', 'top': 0 });
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };

  return (
    <div
      data-slot='floating-menu'
      className={ cn(
        'pointer-events-none inset-x-0 top-3 z-[var(--ds-z-nav)] flex justify-center px-3',
        position === 'sticky' ? 'sticky h-0 overflow-visible' : 'fixed'
      ) }
    >
      <nav
        aria-label={ label }
        data-state={ visible ? 'visible' : 'hidden' }
        onBlur={ handleBlur }
        onFocus={ () => setFocused(true) }
        className={ cn(
          'flex h-fit min-w-0 max-w-full items-center gap-1 rounded-control bg-text p-1 text-surface shadow-[var(--ds-shadow-floating)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
          visible ? 'pointer-events-auto translate-y-0 opacity-100' : '-translate-y-[calc(100%+1rem)] opacity-0',
          className
        ) }
      >
        {items.length ? (
          <ul className='m-0 flex min-w-0 list-none items-center gap-1 overflow-x-auto p-0 [scrollbar-width:none] sm:gap-2'>
            {items.map((item) => {
              const current = item.active ?? item.href === activeHref;

              return (
                <li key={ item.href } className='shrink-0'>
                  <Link
                    href={ item.href }
                    variant='bare'
                    aria-current={ current ? 'page' : undefined }
                    className='flex min-h-10 items-center rounded-control px-2.5 text-xs font-medium text-surface/80 hover:bg-surface/10 hover:text-surface aria-[current=page]:bg-surface/15 aria-[current=page]:text-surface sm:px-3 sm:text-sm'
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
        {actions ? <div className='flex shrink-0 items-center gap-1'>{actions}</div> : null}
        {backToTop ? (
          <Button
            variant='ghost'
            tone='neutral'
            size='sm'
            onClick={ scrollToTop }
            aria-label='Back to top'
            className='h-10 shrink-0 gap-1.5 rounded-control border border-surface/30 px-2.5 text-surface hover:bg-surface/10 hover:text-surface'
          >
            <Icon name='ArrowUpCircle' size='sm' decorative />
            <span className='hidden md:inline'>Back to top</span>
          </Button>
        ) : null}
      </nav>
    </div>
  );
};

export default FloatingMenu;
