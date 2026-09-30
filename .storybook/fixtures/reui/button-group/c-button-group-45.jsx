// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupText
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const environments = [
  {
    id: 'development',
    label: 'Dev',
    tooltip: 'Local development environment',
    icon: <RegistryIcon lucide='Code2Icon' aria-hidden='true' />
  },
  {
    id: 'staging',
    label: 'Staging',
    tooltip: 'Pre-production mirror',
    icon: <RegistryIcon lucide='TestTube2Icon' aria-hidden='true' />
  },
  {
    id: 'production',
    label: 'Production',
    tooltip: 'Live environment \u2014 affects real users',
    icon: <RegistryIcon lucide='GlobeIcon' aria-hidden='true' />
  }
];
export function Pattern() {
  const [active, setActive] = useState('development');
  return (
    <ButtonGroup className='max-w-full overflow-x-auto'>
      <TooltipProvider>
        {environments.map((env) => (
          <Tooltip key={env.id}>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                className={cn(active === env.id ? 'bg-ui-muted' : '')}
                onClick={() => setActive(env.id)}
              >
                {env.icon}
                {env.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{env.tooltip}</TooltipContent>
          </Tooltip>
        ))}
        {active === 'production' ? (
          <ButtonGroupText className='bg-transparent'>
            <div className='bg-success size-1.5 rounded-full' />
            <span>Live</span>
          </ButtonGroupText>
        ) : null}
      </TooltipProvider>
    </ButtonGroup>
  );
}
