// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <RegistryIcon lucide='LayoutDashboardIcon' aria-hidden='true' />
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <RegistryIcon lucide='BarChart2Icon' aria-hidden='true' />
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
  },
  {
    id: 'help',
    label: 'Help',
    icon: <RegistryIcon lucide='CircleHelpIcon' aria-hidden='true' />
  }
];
export function Pattern() {
  const [active, setActive] = useState('dashboard');
  return (
    <ButtonGroup orientation='vertical'>
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant='outline'
          className={cn(
            'justify-start',
            active === item.id ? 'bg-ui-muted' : ''
          )}
          onClick={() => setActive(item.id)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
