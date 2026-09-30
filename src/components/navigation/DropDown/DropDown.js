'use client';

/**
 * Menu Dropdown Component
 *
 * @description A header-style disclosure trigger: a ghost Button with a rotating chevron that toggles a
 * host-owned panel and closes it on Escape or a click outside `outsideClickRef`. The site header's own
 * dropdowns use NavigationMenuDropdown; reach for this only to wire a custom panel.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

import { useEffect, useRef } from 'react';

import Button from '../../core/Button';
import Icon from '../../core/Icon';
import { cn } from '../../../utilities/cn';

/**
 * Dropdown trigger with outside-click and Escape dismissal
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Extra classes for the trigger
 * @param {string} [props.controlsId] - Id of the panel the trigger controls
 * @param {string} [props.id] - Trigger id, for aria-labelledby on the panel
 * @param {string} props.name - Trigger label
 * @param {boolean} props.menuDropDownOpen - Whether the panel is open
 * @param {React.RefObject} [props.outsideClickRef] - Boundary for outside clicks; defaults to the trigger
 * @param {Function} props.setMenuDropDownOpen - Sets the open state
 *
 * @returns {JSX.Element} The trigger button
 *
 * @example
 * <MenuDropDown name='Categories' menuDropDownOpen={open} setMenuDropDownOpen={setOpen} controlsId='categories-panel' />
 */
const MenuDropDown = ({ className, controlsId, id, name, menuDropDownOpen, outsideClickRef, setMenuDropDownOpen }) => {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!menuDropDownOpen) return undefined;

    const boundary = outsideClickRef || triggerRef;
    const handleClick = (event) => {
      if (boundary.current && !boundary.current.contains(event.target)) setMenuDropDownOpen(false);
    };

    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, [ menuDropDownOpen, outsideClickRef, setMenuDropDownOpen ]);

  const handleKeyDown = (event) => {
    if (event.key !== 'Escape' || !menuDropDownOpen) return;
    event.preventDefault();
    setMenuDropDownOpen(false);
  };

  return (
    <Button
      ref={ triggerRef }
      variant='ghost'
      tone='neutral'
      className={ cn('gap-1 px-1.5 hover:bg-transparent hover:text-accent pointer-coarse:min-h-11', menuDropDownOpen && 'text-accent', className) }
      aria-controls={ controlsId }
      aria-expanded={ menuDropDownOpen }
      aria-haspopup='true'
      id={ id }
      onClick={ () => setMenuDropDownOpen(!menuDropDownOpen) }
      onKeyDown={ handleKeyDown }
    >
      {name}
      <Icon
        name='ChevronDown'
        decorative
        size='xs'
        className={ cn('flex-none text-text-subtle transition-transform duration-200 motion-reduce:transition-none', menuDropDownOpen && 'rotate-180 text-current') }
      />
    </Button>
  );
};

export default MenuDropDown;
