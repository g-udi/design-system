'use client';

/**
 * MenuDropdownPanel Component
 *
 * @description The shared dropdown shell behind MenuBlog and MenuMain: trigger
 * button, open/close state, Escape/ArrowDown keyboard handling, viewport-aware
 * alignment, and the category list. An optional aside slot renders a second
 * panel column (MenuMain uses it for recent posts).
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import React from 'react';

import MenuDropDown from '../DropDown';
import Link from '../../core/Link';
import { cn } from '../../../utilities/cn';
import { formatCategoryTitle } from '../../../utilities/taxonomy';

/**
 * Renders a viewport-aware dropdown panel with a category list
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.aside] - Optional second panel column (widens the panel to a two-column grid)
 * @param {Array<Object>} props.categories - Blog category objects ({ id, title, description })
 * @param {string} props.name - Trigger button label
 *
 * @returns {JSX.Element} The rendered dropdown panel
 *
 * @example
 * <MenuDropdownPanel name='Categories' categories={categories} />
 */
const MenuDropdownPanel = ({ aside, categories, name }) => {
  const [ menuOpen, setMenuOpen ] = React.useState(false);
  const [ alignment, setAlignment ] = React.useState('center');
  const containerRef = React.useRef(null);
  const dropdownRef = React.useRef(null);
  const dropdownId = React.useId();
  const triggerId = `${dropdownId}-trigger`;

  const closeMenu = React.useCallback((returnFocus = false) => {
    setMenuOpen(false);
    if (returnFocus) requestAnimationFrame(() => document.getElementById(triggerId)?.focus());
  }, [ triggerId ]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && menuOpen) {
      event.preventDefault();
      closeMenu(true);

      return;
    }

    if (event.key === 'ArrowDown' && event.target?.id === triggerId && menuOpen) {
      event.preventDefault();
      dropdownRef.current?.querySelector('a[href]')?.focus();
    }
  };

  React.useLayoutEffect(() => {
    if (!menuOpen) return;

    const updateAlignment = () => {
      if (!containerRef.current || !dropdownRef.current) return;

      const triggerRect = containerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.firstElementChild?.getBoundingClientRect() || dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const gutter = 12;
      const centeredLeft = triggerRect.left + (triggerRect.width / 2) - (dropdownRect.width / 2);
      const centeredRight = centeredLeft + dropdownRect.width;

      if (centeredLeft < gutter) {
        setAlignment('left');
      } else if (centeredRight > viewportWidth - gutter) {
        setAlignment('right');
      } else {
        setAlignment('center');
      }
    };

    updateAlignment();
    window.addEventListener('resize', updateAlignment);

    return () => {
      window.removeEventListener('resize', updateAlignment);
    };
  }, [ menuOpen ]);

  return (<li ref={ containerRef } className='relative' onKeyDown={ handleKeyDown }>

    <MenuDropDown controlsId={ dropdownId } id={ triggerId } name={ name } menuDropDownOpen={ menuOpen } outsideClickRef={ containerRef } setMenuDropDownOpen={ setMenuOpen }></MenuDropDown>

    {menuOpen ? (
      <div
        id={ dropdownId }
        aria-labelledby={ triggerId }
        ref={ dropdownRef }
        className={ cn(
          'absolute top-full z-50 mt-2 flex w-screen max-w-max px-2',
          alignment === 'left' && 'left-0',
          alignment === 'center' && 'left-1/2 -translate-x-1/2',
          alignment === 'right' && 'right-0'
        ) }
      >
        <div
          className={ cn(
            'w-screen flex-auto overflow-hidden rounded-xl bg-white text-sm leading-5 shadow-2xl shadow-gray-950/15 dark:bg-gray-900 dark:shadow-black/50',
            aside ? 'grid max-w-3xl grid-cols-2' : 'max-w-sm'
          ) }
        >
          <div className='p-2'>

            {categories.map((category) => (
              <div key={ category.id } className='group relative flex rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800'>
                <div>
                  <Link href={ `/blog/categories/${category.id}` } className='text-sm font-semibold capitalize text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300'>
                    {formatCategoryTitle(category.title)}
                    <span className='absolute inset-0'></span>
                    <p className='mt-0.5 text-xs font-normal leading-5 text-gray-600 dark:text-gray-300'>{category.description}</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {aside}

        </div>
      </div>
    ) : null}

  </li>);
};

export default MenuDropdownPanel;
