// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const orderTypes = [
  {
    id: 'market',
    label: 'Market',
    tooltip: 'Execute immediately at best available price',
    icon: <RegistryIcon lucide='TrendingUpIcon' aria-hidden='true' />
  },
  {
    id: 'limit',
    label: 'Limit',
    tooltip: 'Execute only at your specified price or better',
    icon: <RegistryIcon lucide='TargetIcon' aria-hidden='true' />
  },
  {
    id: 'stop',
    label: 'Stop',
    tooltip: 'Trigger a market order at stop level',
    icon: <RegistryIcon lucide='ShieldAlertIcon' aria-hidden='true' />
  },
  {
    id: 'stop-limit',
    label: 'Stop-Limit',
    tooltip: 'Trigger a limit order at stop level',
    icon: <RegistryIcon lucide='ShieldCheckIcon' aria-hidden='true' />
  }
];
export function Pattern() {
  const [active, setActive] = useState('market');
  return (
    <ButtonGroup className='max-w-full overflow-x-auto'>
      <TooltipProvider>
        {orderTypes.map((type) => (
          <Tooltip key={type.id}>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                className={cn(active === type.id ? 'bg-ui-muted' : '')}
                onClick={() => setActive(type.id)}
              >
                {type.icon}
                {type.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent className='max-w-52 text-center'>
              {type.tooltip}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </ButtonGroup>
  );
}
