'use client';

/**
 * MenuMobile
 *
 * @description The site header's phone sheet (private to Blocks/Navigation): search, the Blog destination
 * with its categories, and the other site links. The header mounts it below `lg` while open and closes it
 * when the layout crosses the desktop breakpoint.
 */

import React from 'react';

import Button from '../../core/Button';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { ScrollArea } from '../../core/ScrollArea';
import { Sheet, SheetContent, SheetTitle } from '../../core/Sheet';
import MenuSearch from './MenuSearch.jsx';
import { cn } from '../../../utilities/cn';

/**
 * Renders the mobile navigation sheet
 *
 * @description Right-hand Sheet with a search bar, close button, blog categories with descriptions,
 * and main navigation links. The Sheet owns focus, Escape, the overlay and the inert background.
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
 * @returns {JSX.Element} Mobile navigation sheet
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

const MenuMobile = ({ blogLink, categories = [], container, links = [], setMobileMenuOpen, setLauncherOpen }) => {
  const closeButtonRef = React.useRef(null);
  // The header mounts this sheet without a Radix trigger, so it restores focus to the opener itself.
  const openerRef = React.useRef(null);
  const categoriesId = React.useId();
  const close = () => setMobileMenuOpen(false);

  const handleSearchOpen = (open) => {
    if (open) close();
    setLauncherOpen(open);
  };

  return (
    <Sheet open onOpenChange={ (open) => !open && close() }>
      <SheetContent
        side='right'
        container={ container }
        showCloseButton={ false }
        aria-describedby={ undefined }
        className='w-5/6 gap-0 bg-surface text-text'
        onOpenAutoFocus={ (event) => {
          openerRef.current = document.activeElement;
          event.preventDefault();
          closeButtonRef.current?.focus();
        } }
        onCloseAutoFocus={ (event) => {
          event.preventDefault();
          if (openerRef.current?.isConnected) openerRef.current.focus();
        } }
      >
        <SheetTitle className='sr-only'>Mobile navigation</SheetTitle>
        <div className='flex items-start gap-2 p-4 pb-0 sm:p-5 sm:pb-0'>
          <MenuSearch className='min-w-0 flex-1 sm:w-auto' setOpen={ handleSearchOpen } />
          <Button ref={ closeButtonRef } variant='ghost' tone='neutral' size='icon' className='size-11 text-text-muted hover:text-text' onClick={ close }>
            <span className='sr-only'>Close menu</span>
            <Icon name='X' decorative size='sm' />
          </Button>
        </div>
        <ScrollArea className='min-h-0 flex-1' aria-label='Navigation links'>
          <nav aria-label='Mobile navigation links' className='p-4 sm:p-5'>
            {blogLink ? <ul className='m-0 grid list-none gap-1 p-0'>
              <li>
                <Link href={ blogLink.href } variant='bare' onClick={ close } className={ cn(rowClassName, 'font-semibold') }>
                  {blogLink.title}
                </Link>
                {categories.length ? <>
                  <span className='sr-only' id={ categoriesId }>Blog categories</span>
                  <ul aria-labelledby={ categoriesId } className='m-0 ms-2 mt-1 grid list-none gap-0.5 p-0'>
                    {categories.map((category) => (
                      <li key={ category.id }>
                        <Link href={ category.href } variant='bare' onClick={ close } className={ cn(rowClassName, 'py-2') }>
                          <span className='block font-semibold'>{category.title}</span>
                          <span className='mt-0.5 block text-xs text-text-muted'>{category.description}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </> : null}
              </li>
            </ul> : null}

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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MenuMobile;
