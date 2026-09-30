// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '../../../../src/components/core/NavigationMenu/parts/navigation-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const industries = [
  {
    title: 'Individuals',
    description: 'Keep your finances organized.',
    href: '#',
    icon: <RegistryIcon lucide='UserIcon' />
  },
  {
    title: 'LLCs',
    description: 'Benefit from tax write-offs.',
    href: '#',
    icon: <RegistryIcon lucide='BuildingIcon' />
  },
  {
    title: 'Freelancers',
    description: 'For independent workers.',
    href: '#',
    icon: <RegistryIcon lucide='CircleDollarSignIcon' />
  },
  {
    title: 'Investors',
    description: 'Make and grow your money.',
    href: '#',
    icon: <RegistryIcon lucide='LayoutGridIcon' />
  },
  {
    title: 'Small businesses',
    description: 'We take care of your taxes.',
    href: '#',
    icon: <RegistryIcon lucide='SparklesIcon' />
  },
  {
    title: 'Crypto',
    description: 'For tech enthusiasts.',
    href: '#',
    icon: <RegistryIcon lucide='CircleDollarSignIcon' />
  },
  {
    title: 'Big companies',
    description: 'Run your finances easily.',
    href: '#',
    icon: <RegistryIcon lucide='BuildingIcon' />
  },
  {
    title: 'Investments',
    description: 'Launch your ideas worldwide.',
    href: '#',
    icon: <RegistryIcon lucide='RadioIcon' />
  }
];
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Industries</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className='w-[500px]'>
                <ul className='grid grid-cols-2 gap-1'>
                  {industries.map((item) => (
                    <li key={item.title}>
                      <NavigationMenuLink
                        asChild
                        className='flex items-start gap-2 p-3'
                      >
                        <a href='#'>
                          {item.icon}
                          <div className='flex flex-col gap-0.5'>
                            <div className='text-sm leading-none font-medium'>
                              {item.title}
                            </div>
                            <p className='text-ui-muted-foreground text-xs leading-snug'>
                              {item.description}
                            </p>
                          </div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
                <div className='mt-2 px-1 pb-1'>
                  <Button className='w-full' asChild>
                    <a href='#'>Learn more</a>
                  </Button>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
