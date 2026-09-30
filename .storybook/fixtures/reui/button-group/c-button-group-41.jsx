// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
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
const models = [
  {
    id: 'gpt4o',
    label: 'GPT-4o',
    badge: 'Fast',
    badgeVariant: 'success-light',
    tooltip: '128k context, fastest response',
    icon: <RegistryIcon lucide='ZapIcon' aria-hidden='true' />
  },
  {
    id: 'claude',
    label: 'Claude',
    badge: 'Pro',
    badgeVariant: 'info-light',
    tooltip: '200k context, best for analysis',
    icon: <RegistryIcon lucide='BrainIcon' aria-hidden='true' />
  },
  {
    id: 'gemini',
    label: 'Gemini',
    badge: 'Preview',
    badgeVariant: 'warning-light',
    tooltip: '1M context, experimental',
    icon: <RegistryIcon lucide='FlaskConicalIcon' aria-hidden='true' />
  }
];
export function Pattern() {
  const [active, setActive] = useState('claude');
  return (
    <ButtonGroup className='max-w-full overflow-x-auto'>
      <TooltipProvider>
        {models.map((model) => (
          <Tooltip key={model.id}>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                className={cn('shrink-0 whitespace-nowrap', active === model.id ? 'bg-ui-muted' : '')}
                onClick={() => setActive(model.id)}
              >
                {model.icon}
                {model.label}
                <Badge variant={model.badgeVariant} size='xs'>
                  {model.badge}
                </Badge>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{model.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </ButtonGroup>
  );
}
