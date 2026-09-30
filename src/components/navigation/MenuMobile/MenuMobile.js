'use client';

/**
 * MenuMobile Component
 *
 * @description Mobile responsive navigation menu component that provides a full-screen overlay
 * navigation experience for mobile devices. Features categories, navigation links, and search functionality.
 * Includes proper accessibility attributes and smooth animations.
 * The parent menu closes it when the layout crosses the desktop breakpoint.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import React from 'react';

import Button from '../../core/Button';
import Dialog from '../../core/Dialog';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import MenuSearch from '../MenuSearch';
import { formatCategoryTitle } from '../../../utilities/taxonomy';


/**
 * Renders a full-screen mobile navigation menu
 *
 * @description Comprehensive mobile menu that overlays the entire screen when opened.
 * Features a search bar (on small screens), close button, blog categories with descriptions,
 * and main navigation links. The menu uses proper semantic HTML
 * with ARIA attributes for accessibility and includes dark mode support.
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.categories - Array of blog category objects
 * @param {string} props.categories[].id - Unique identifier for the category
 * @param {string} props.categories[].title - Display title of the category
 * @param {string} props.categories[].description - Brief description of the category
 * @param {Object} [props.blogLink] - Explicit primary blog destination
 * @param {Array<Object>} props.links - Array of additional navigation link objects
 * @param {string} props.links[].href - URL for the navigation link
 * @param {string} props.links[].title - Display text for the navigation link
 * @param {Function} props.setMobileMenuOpen - Function to close the mobile menu
 * @param {Function} props.setLauncherOpen - Function to open the search/command launcher
 * @param {HTMLElement} [props.container] - Element the dialog renders into and isolates; defaults to the body
 *
 * @returns {JSX.Element} Full-screen mobile navigation menu overlay
 *
 * @example
 * // Basic usage in mobile navigation
 * const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 * const [isLauncherOpen, setIsLauncherOpen] = useState(false);
 *
 * <MenuMobile
 *   categories={blogCategories}
 *   links={navigationLinks}
 *   setMobileMenuOpen={setIsMobileMenuOpen}
 *   setLauncherOpen={setIsLauncherOpen}
 * />
 *
 * @example
 * // The parent menu closes this dialog when the desktop breakpoint is reached.
 */
const MenuMobile = ({ blogLink = { href: '/blog', title: 'Blog' }, categories = [], container, links = [], setMobileMenuOpen, setLauncherOpen }) => {
  const closeButtonRef = React.useRef(null);
  const categoriesId = React.useId();

  const handleSearchOpen = (open) => {
    if (open) setMobileMenuOpen(false);
    setLauncherOpen(open);
  };

  return (
    <Dialog
      variant='bare'
      open
      onOpenChange={ (open) => !open && setMobileMenuOpen(false) }
      container={ container }
      initialFocusRef={ closeButtonRef }
      label='Mobile navigation'
      className='fixed inset-0 z-[var(--ds-z-overlay)]'
    >
      <button
        type='button'
        tabIndex={ -1 }
        aria-hidden='true'
        className='absolute inset-0 cursor-default bg-gray-950/35 dark:bg-black/60'
        onClick={ () => setMobileMenuOpen(false) }
      />

      <div className='absolute inset-y-0 right-0 flex w-5/6 max-w-sm flex-col overflow-y-auto bg-white px-4 py-4 shadow-2xl shadow-gray-950/20 dark:bg-gray-950 dark:shadow-black/60 sm:px-5 sm:py-5'>
          <div className='mb-5 flex items-start justify-between gap-2'>
          <div className='w-full'>
            <MenuSearch className='w-full sm:w-full' setOpen={ handleSearchOpen }></MenuSearch>
          </div>
          <Button ref={ closeButtonRef } variant='ghost' tone='neutral' size='sm' className='h-11 w-11 shrink-0 rounded-md p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100' onClick={ () => setMobileMenuOpen(false) }>
            <span className='sr-only'>Close menu</span>
            <Icon name='X' decorative size='sm' />
          </Button>
        </div>
        <nav aria-label='Mobile navigation links'>
          <ul className='space-y-1'>
            <li>
              <Link
                href={ blogLink.href }
                onClick={ () => setMobileMenuOpen(false) }
                className='block min-h-11 rounded-md px-3 py-2.5 text-sm font-semibold leading-6 text-gray-950 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-100 dark:hover:bg-gray-900 dark:hover:text-blue-300'
              >
                {blogLink.title}
              </Link>
              {categories.length ? <>
                <span className='sr-only' id={ categoriesId }>Blog categories</span>
                <ul aria-labelledby={ categoriesId } className='ml-2 mt-1 space-y-0.5'>
                {categories.map((category) => (
                  <li key={ category.id }>
                    <Link
                      href={ `/blog/categories/${category.id}` }
                      onClick={ () => setMobileMenuOpen(false) }
                      className='group block rounded-md px-3 py-2 text-gray-950 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-100 dark:hover:bg-gray-900 dark:hover:text-blue-300'
                    >
                      <span className='block text-sm font-semibold leading-5'>{formatCategoryTitle(category.title)}</span>
                      <span className='mt-0.5 block text-xs font-normal leading-5 text-gray-600 group-hover:text-blue-700 dark:text-gray-300 dark:group-hover:text-blue-200'>{category.description}</span>
                    </Link>
                  </li>
                ))}
                </ul>
              </> : null}
            </li>
          </ul>

          {links.length ? (
            <ul className='mt-4 space-y-1 border-t border-gray-200 pt-4 dark:border-gray-800'>
              {links.map((link) => (
                <li key={ link.href }>
                  <Link
                    href={ link.href }
                    onClick={ () => setMobileMenuOpen(false) }
                    className='block min-h-11 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium leading-6 text-gray-950 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-100 dark:hover:bg-gray-900 dark:hover:text-blue-300'
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </nav>

      </div>
    </Dialog>
  );
};

export default MenuMobile;
