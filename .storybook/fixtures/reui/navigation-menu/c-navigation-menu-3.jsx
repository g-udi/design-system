// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '../../../../src/components/core/NavigationMenu/parts/navigation-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Status</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid w-[200px] gap-2'>
                <li>
                  <NavigationMenuLink asChild>
                    <a href='#' className='flex items-center gap-2'>
                      <RegistryIcon lucide='CircleAlertIcon' />
                      Backlog
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a href='#' className='flex items-center gap-2'>
                      <RegistryIcon lucide='CircleCheckIcon' />
                      Done
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
