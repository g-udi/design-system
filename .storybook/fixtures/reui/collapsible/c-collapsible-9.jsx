// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import {
  Item,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const navItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <RegistryIcon lucide='LayoutDashboardIcon' />,
    items: [
      {
        id: 'analytics',
        name: 'Analytics',
        icon: <RegistryIcon lucide='ChartBarIcon' />,
        items: [
          {
            id: 'real-time',
            name: 'Real-time',
            icon: <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />
          },
          {
            id: 'historical',
            name: 'Historical',
            icon: <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />
          }
        ]
      },
      {
        id: 'reports',
        name: 'Reports',
        icon: <RegistryIcon lucide='MessageSquareIcon' aria-hidden='true' />
      }
    ]
  },
  {
    id: 'team',
    name: 'Team',
    icon: <RegistryIcon lucide='UserIcon' aria-hidden='true' />,
    items: [
      {
        id: 'members',
        name: 'Members',
        icon: <RegistryIcon lucide='UserIcon' aria-hidden='true' />
      },
      {
        id: 'permissions',
        name: 'Permissions',
        icon: <RegistryIcon lucide='ShieldIcon' aria-hidden='true' />
      }
    ]
  },
  {
    id: 'billing',
    name: 'Billing',
    icon: <RegistryIcon lucide='CreditCardIcon' aria-hidden='true' />
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: <RegistryIcon lucide='BellIcon' aria-hidden='true' />
  }
];
function NavMenuItem({ item, level = 0, selectedId, onSelect }) {
  const isFolder = !!item.items && item.items.length > 0;
  const isSelected = selectedId === item.id;
  if (isFolder) {
    return (
      <Collapsible className='group/collapsible'>
        <CollapsibleTrigger asChild>
          <Item
            as='button'
            type='button'
            size='xs'
            className='hover:bg-ui-accent data-[state=open]:bg-ui-accent group/item cursor-pointer py-1.25'
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            <ItemMedia variant='icon'>
              <div className='text-ui-muted-foreground group-hover/item:text-ui-foreground size-3.5'>
                {item.icon}
              </div>
            </ItemMedia>
            <ItemTitle className='text-sm group-data-[state=open]/collapsible:font-semibold'>
              {item.name}
            </ItemTitle>
            <RegistryIcon
              lucide='ChevronRightIcon'
              aria-hidden='true'
              className='text-ui-muted-foreground ml-auto size-4 transition-transform in-data-[state=open]:rotate-90'
            />
          </Item>
        </CollapsibleTrigger>
        <CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden pt-0.5'>
          <div className='flex flex-col gap-0.5'>
            {item.items?.map((child) => (
              <NavMenuItem
                key={child.id}
                item={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
  return (
    <Item
      as='button'
      type='button'
      size='xs'
      className='hover:bg-ui-accent data-[active=true]:bg-ui-accent data-[active=true]:text-ui-foreground group/item cursor-pointer py-1.25'
      data-active={isSelected}
      style={{ paddingLeft: `${level * 12 + 8}px` }}
      onClick={() => onSelect(item.id)}
    >
      <ItemMedia variant='icon'>
        <div className='text-ui-muted-foreground group-hover/item:text-ui-foreground group-data-[active=true]/item:text-ui-foreground size-3.5'>
          {item.icon}
        </div>
      </ItemMedia>
      <ItemTitle className='text-sm'>{item.name}</ItemTitle>
    </Item>
  );
}
export function Pattern() {
  const [selectedId, setSelectedId] = useState('real-time');
  return (
    <div className='min-h-64 w-full max-w-56'>
      <Card className='p-0'>
        <CardContent className='p-1'>
          <div className='flex flex-col gap-0.5'>
            {navItems.map((item) => (
              <NavMenuItem
                key={item.id}
                item={item}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
