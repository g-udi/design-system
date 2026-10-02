'use client';

/**
 * MenuMobile
 *
 * @description The site header's phone sheet (private to Blocks/Navigation): search, the Blog destination
 * with its categories, and the other site links. The header mounts it below `lg` while open and closes it
 * when the layout crosses the desktop breakpoint.
 */

import React from 'react';

import Button from '../../../core/Button';
import Dialog from '../../../core/Dialog';
import Icon from '../../../core/Icon';
import Link from '../../../core/Link';
import MenuSearch from './MenuSearch.jsx';
import { cn } from '../../../../utilities/cn';
import { formatCategoryTitle } from '../../../../utilities/taxonomy';

/**
 * Renders a full-screen mobile navigation menu
 *
 * @description Comprehensive mobile menu that overlays the entire screen when opened.
 * Features a search bar (on small screens), close button, blog categories with descriptions,
 * and main navigation links, inside a bare Dialog that owns focus, Escape and the inert background.
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
const rowClassName = 'block rounded-control px-3 py-2.5 text-sm text-text hover:bg-surface-muted hover:text-accent';

const MenuMobile = ({ blogLink = { href: '/blog', title: 'Blog' }, categories = [], container, links = [], setMobileMenuOpen, setLauncherOpen }) => {
  const closeButtonRef = React.useRef(null);
  const categoriesId = React.useId();
  const close = () => setMobileMenuOpen(false);

  const handleSearchOpen = (open) => {
    if (open) close();
    setLauncherOpen(open);
  };

  // Bare Dialog content fills the screen and closes when its own backdrop is clicked.
  return (
    <Dialog
      variant='bare'
      open
      onOpenChange={ (open) => !open && close() }
      container={ container }
      initialFocusRef={ closeButtonRef }
      label='Mobile navigation'
      className='fixed inset-0 z-[var(--ds-z-overlay)] bg-[var(--ds-color-launcher-overlay-bg)]'
    >
      <div className='absolute inset-y-0 right-0 flex w-5/6 max-w-sm flex-col overflow-y-auto border-s border-border bg-surface p-4 shadow-2xl sm:p-5'>
        <div className='mb-5 flex items-start gap-2'>
          <MenuSearch className='min-w-0 flex-1 sm:w-auto' setOpen={ handleSearchOpen } />
          <Button ref={ closeButtonRef } variant='ghost' tone='neutral' size='icon' className='size-11 text-text-muted hover:text-text' onClick={ close }>
            <span className='sr-only'>Close menu</span>
            <Icon name='X' decorative size='sm' />
          </Button>
        </div>
        <nav aria-label='Mobile navigation links'>
          <ul className='m-0 grid list-none gap-1 p-0'>
            <li>
              <Link href={ blogLink.href } variant='bare' onClick={ close } className={ cn(rowClassName, 'font-semibold') }>
                {blogLink.title}
              </Link>
              {categories.length ? <>
                <span className='sr-only' id={ categoriesId }>Blog categories</span>
                <ul aria-labelledby={ categoriesId } className='m-0 ms-2 mt-1 grid list-none gap-0.5 p-0'>
                  {categories.map((category) => (
                    <li key={ category.id }>
                      <Link href={ `/blog/categories/${category.id}` } variant='bare' onClick={ close } className={ cn(rowClassName, 'py-2') }>
                        <span className='block font-semibold'>{formatCategoryTitle(category.title)}</span>
                        <span className='mt-0.5 block text-xs text-text-muted'>{category.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </> : null}
            </li>
          </ul>

          {links.length ? (
            <ul className='m-0 mt-4 grid list-none gap-1 border-t border-border p-0 pt-4'>
              {links.map((link) => (
                <li key={ link.href }>
                  <Link href={ link.href } variant='bare' onClick={ close } className={ cn(rowClassName, 'whitespace-nowrap font-medium') }>
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
