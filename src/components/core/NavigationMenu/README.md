# NavigationMenu

A site navigation bar with plain links and dropdown panels of related destinations. Use it for a header's primary navigation; use `DropdownMenu` for actions and `Tabs` for views within one page.

```jsx
import { NavigationMenu, NavigationMenuDropdown, NavigationMenuLink, NavigationMenuList, NavigationMenuPanel } from '@gaudi/design-system';

<NavigationMenu label='Main navigation'>
  <NavigationMenuList>
    <NavigationMenuLink href='/blog' active>Blog</NavigationMenuLink>
    <NavigationMenuDropdown label='Categories' align='start' width='lg'>
      <NavigationMenuPanel columns={2}>
        <NavigationMenuLink variant='panel' href='/blog/categories/data' description='Knowledge graphs and retrieval'>Data</NavigationMenuLink>
      </NavigationMenuPanel>
    </NavigationMenuDropdown>
  </NavigationMenuList>
</NavigationMenu>
```

Dropdowns open on click, close on Escape (focus returns to the trigger) or an outside click, and only one is open at a time. `align` and `width` place and size a panel, which is nudged back inside the viewport near an edge; `defaultOpen` starts one open. `active` marks the current page with `aria-current="page"`. Links close the open panel when followed.

The convenience components are built on the composition parts (`NavigationMenuRoot`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLinkPrimitive`, `NavigationMenuViewport`, `NavigationMenuIndicator`), which add hover-to-open and a shared animated viewport for custom menus.
