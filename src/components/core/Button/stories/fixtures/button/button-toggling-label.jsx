'use client';
import { useState } from 'react';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// Two icons stacked in one slot: the active one scales in while the other rotates out.
const Swap = ({ on, from, to }) => (
  <span className='relative flex size-4 items-center justify-center'>
    <RegistryIcon lucide={from} aria-hidden='true' className={cn('absolute size-4 transition-all duration-200', on ? 'scale-75 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100')} />
    <RegistryIcon lucide={to} aria-hidden='true' className={cn('absolute size-4 transition-all duration-200', on ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-90 opacity-0')} />
  </span>
);

export function Pattern() {
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Button size='icon' variant='outline' aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
        <Swap on={menu} from='MenuIcon' to='XIcon' />
      </Button>
      <Button size='icon' variant='outline' aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`} aria-pressed={dark} onClick={() => setDark((v) => !v)}>
        <Swap on={dark} from='SunIcon' to='MoonIcon' />
      </Button>
      <Button variant='ghost' aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
        {expanded ? 'Show less' : 'Show more'}
        <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' className={cn('transition-transform duration-200', expanded && 'rotate-180')} />
      </Button>
    </div>
  );
}
