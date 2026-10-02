'use client';

/**
 * MenuSearch
 *
 * @description The site header's search entry (part of Blocks/Navigation): a field-like button with the
 * Cmd+K hint that asks the host to open the command launcher. Also exported as a visible trigger for
 * Commander in custom headers.
 */

import Button from '../../../core/Button';
import Kbd from '../../../core/Kbd';
import { cn } from '../../../../utilities/cn';

/**
 * Renders a search input button that opens the command palette
 *
 * @description Interactive search component that displays a styled input field with a Cmd+K keyboard
 * shortcut indicator. When clicked, it triggers the search/command launcher modal. The component
 * is fully responsive and adapts its width based on screen size.
 *
 * @param {Object} props - Component props
 * @param {Function} props.setOpen - Function to open the search/command launcher modal
 *
 * @returns {JSX.Element} Search input button with keyboard shortcut indicator
 *
 * @example
 * // Basic usage in navigation
 * const [isLauncherOpen, setIsLauncherOpen] = useState(false);
 * <MenuSearch setOpen={setIsLauncherOpen} />
 *
 * @example
 * // Used within mobile menu
 * <MenuSearch setOpen={setLauncherOpen} />
 */
const MenuSearch = ({ className, setOpen }) => (

  <div className={ cn('w-full sm:w-56 lg:w-52 xl:w-60', className) }>
    <Button
      variant='outline'
      tone='neutral'
      className='h-9 w-full justify-between gap-3 bg-surface px-3 font-normal text-text-muted hover:text-text pointer-coarse:h-11'
      onClick={ () => setOpen(true) }
      aria-label='Open search'
    >
      <span className='truncate'>Search</span>
      <span className='hidden shrink-0 items-center gap-1 lg:flex' aria-hidden='true'>
        <Kbd keys='command' size='sm' variant='flat' />
        <Kbd keys='k' size='sm' variant='flat' />
      </span>
    </Button>
  </div>

);

export default MenuSearch;
