// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const intervals = [
  {
    id: '1m',
    icon: <RegistryIcon lucide='ClockIcon' aria-hidden='true' />
  },
  {
    id: '5m',
    icon: <RegistryIcon lucide='ClockIcon' aria-hidden='true' />
  },
  {
    id: '1H',
    icon: <RegistryIcon lucide='ClockIcon' aria-hidden='true' />
  },
  {
    id: '1D',
    icon: <RegistryIcon lucide='CalendarIcon' aria-hidden='true' />
  },
  {
    id: '1W',
    icon: <RegistryIcon lucide='CalendarDaysIcon' aria-hidden='true' />
  },
  {
    id: 'Auto',
    icon: <RegistryIcon lucide='SparklesIcon' aria-hidden='true' />
  }
];
export function Pattern() {
  const [active, setActive] = useState('1H');
  return (
    <ButtonGroup className='max-w-full overflow-x-auto'>
      {intervals.map((interval) => (
        <Button
          key={interval.id}
          variant='outline'
          size='sm'
          className={cn(
            'h-7 gap-1.5 px-2.5 text-xs tabular-nums',
            active === interval.id ? 'bg-ui-muted' : ''
          )}
          onClick={() => setActive(interval.id)}
        >
          {interval.icon}
          {interval.id}
        </Button>
      ))}
    </ButtonGroup>
  );
}
