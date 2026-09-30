'use client';

/**
 * Main Navigation Menu Component
 *
 * @description The primary navigation component that renders the main menu bar with logo, navigation links,
 * theme switcher, search functionality, and mobile menu. Adapts its content based on the current route
 * and provides access to the command launcher interface.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import CommandLauncher from '../../core/CmdLauncher';
import Button from '../../core/Button';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import MenuDropdownPanel from '../MenuDropdownPanel';
import ThemeLogo from '../MenuLogo';
import MenuMain from '../MenuMain';
import MenuMobile from '../MenuMobile';
import MenuSearch from '../MenuSearch';
import ThemeSwitch from '../../../utilities/ThemeSwitcher';
import { coreContent, sortPosts } from '../../../utilities/content';
import { useSiteConfig } from '../../../utilities/SiteConfig';

/**
 * Main navigation menu component
 *
 * @description Renders the primary navigation bar with responsive design, including logo, navigation links,
 * theme switcher, search functionality, and mobile menu. The component adapts its menu items based on
 * the current route and integrates with the command launcher for enhanced navigation.
 *
 * @returns {JSX.Element} The rendered navigation menu component
 *
 * @example
 * <Menu />
 */
const Menu = ({
  categories: categoriesProp,
  posts: postsProp,
  projects: projectsProp,
  publications: publicationsProp,
  tags: tagsProp,
  thoughts: thoughtsProp
}) => {
  const path = usePathname();
  const { metadata, navigation } = useSiteConfig();

  // Memoize expensive operations
  const posts = useMemo(() => coreContent(sortPosts(postsProp || [])), [ postsProp ]);
  const projects = useMemo(() => coreContent(sortPosts(projectsProp || [])), [ projectsProp ]);
  const thoughts = useMemo(() => coreContent(sortPosts(thoughtsProp || [])), [ thoughtsProp ]);
  const menuCategories = categoriesProp || [];
  const menuPublications = publicationsProp || [];
  const menuTags = tagsProp || [];
  const blogLink = navigation.links.find((link) => link.href === '/blog' || link.href === '/blog/');
  const shouldShowLink = (link) => {
    if (link.hideInPath === '*') return Boolean(link.showInPath && path.includes(link.showInPath));

    return !link.hideInPath || !path.includes(link.hideInPath);
  };
  const mobileLinks = navigation.links.filter((link) => link !== blogLink && shouldShowLink(link));

  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);
  const [ LauncherOpen, LauncherSetOpen ] = useState(false);
  const mobileMenuTriggerRef = useRef(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = (event) => {
      if (event.matches) setMobileMenuOpen(false);
    };

    closeOnDesktop(desktopQuery);
    desktopQuery.addEventListener('change', closeOnDesktop);

    return () => desktopQuery.removeEventListener('change', closeOnDesktop);
  }, []);

  return (<nav aria-label='Main navigation' className='flex min-h-14 items-center justify-between gap-4 py-3 lg:py-4'>

    <Link href='/' aria-label={ metadata.author.name || metadata.title || 'Home' } variant='bare' className='shrink-0 text-gray-950 dark:text-white'>
      <ThemeLogo />
    </Link>

    <div className='flex min-w-0 items-center gap-3 lg:gap-5'>
      <ul className='hidden items-center gap-4 lg:flex xl:gap-6'>
        {navigation.links.map((link) => {
          if (!shouldShowLink(link)) return null;

          const isActive = path === link.href || (link.href !== '/' && path.startsWith(`${link.href}/`));

          return (
            <li key={ link.href }>
              <Link
                href={ link.href }
                aria-current={ isActive ? 'page' : undefined }
                className={ `inline-flex min-h-9 items-center whitespace-nowrap rounded-md px-1.5 py-1.5 text-sm font-medium pointer-coarse:min-h-11 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}` }
              >
                {link.title}
              </Link>
            </li>
          );
        })}

        { !path.includes('/blog') && (<MenuMain categories={ menuCategories } allPosts={ posts }></MenuMain>) }
        { path.includes('/blog') && (<MenuDropdownPanel name='Categories' categories={ menuCategories } />) }
      </ul>

      <MenuSearch className='hidden lg:block' setOpen={ LauncherSetOpen }></MenuSearch>

      <ThemeSwitch />

      <div className='flex lg:hidden'>
        <Button ref={ mobileMenuTriggerRef } variant='ghost' tone='neutral' size='sm' className='h-11 w-11 p-0' onClick={ () => setMobileMenuOpen(true) }>
          <span className='sr-only'>Open main menu</span>
          <Icon name='Menu' decorative size='md' />
        </Button>
      </div>

      {mobileMenuOpen ? (
        <MenuMobile
          blogLink={ blogLink }
          categories={ menuCategories }
          links={ mobileLinks }
          setMobileMenuOpen={ setMobileMenuOpen }
          setLauncherOpen={ LauncherSetOpen }
        />
      ) : null}
      <CommandLauncher
        tags={ menuTags }
        projects={ projects }
        posts={ posts }
        thoughts={ thoughts }
        publications={ menuPublications }
        open={ LauncherOpen }
        restoreFocusRef={ mobileMenuTriggerRef }
        setOpen={ LauncherSetOpen }
      />
    </div>
  </nav>
  );
};

export default Menu;
