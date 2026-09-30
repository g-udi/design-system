'use client';

/**
 * MenuDropdownPanel Component
 *
 * @description The site header's category dropdown, built on NavigationMenuDropdown: the trigger,
 * open/close, Escape, outside-click dismissal and viewport clamping come from NavigationMenu. An optional
 * aside renders a second column (MenuMain uses it for recent posts). Render it inside a NavigationMenuList.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

import { NavigationMenuDropdown, NavigationMenuLink } from '../../core/NavigationMenu';
import { cn } from '../../../utilities/cn';
import { formatCategoryTitle } from '../../../utilities/taxonomy';

/**
 * Renders a category dropdown for the site header
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.aside] - Optional second panel column (widens the panel to two columns)
 * @param {Array<Object>} props.categories - Blog category objects ({ id, title, description })
 * @param {string} props.name - Trigger button label
 *
 * @returns {JSX.Element} The dropdown menu item
 *
 * @example
 * <NavigationMenu><NavigationMenuList><MenuDropdownPanel name='Categories' categories={categories} /></NavigationMenuList></NavigationMenu>
 */
const MenuDropdownPanel = ({ aside, categories = [], name }) => (
  <NavigationMenuDropdown
    label={ name }
    align='center'
    panelClassName={ cn('overflow-hidden p-0', aside ? 'grid w-[44rem] sm:grid-cols-2 md:w-[44rem]' : 'w-96 md:w-96') }
  >
    <ul className='m-0 grid list-none content-start gap-0.5 p-2'>
      {categories.map((category) => (
        <li key={ category.id }>
          <NavigationMenuLink variant='panel' href={ `/blog/categories/${category.id}` } description={ category.description }>
            {formatCategoryTitle(category.title)}
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
    {aside}
  </NavigationMenuDropdown>
);

export default MenuDropdownPanel;
