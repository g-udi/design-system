import { useId } from 'react';
import { BadgeRoot as Badge } from '@gaudi/design-system/core/Pill';
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

function Row({ label, children, ...props }) {
  const id = useId();
  return (
    <div className='flex items-center gap-2'>
      <Switch id={id} {...props} />
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export function Pattern() {
  return (
    <TooltipProvider>
      <div className='mx-auto grid w-full max-w-xs gap-3'>
        <Row label='Airplane mode' />
        <Row label='Two-factor authentication' defaultChecked>
          <Tooltip>
            <TooltipTrigger className='text-text-muted' aria-label='About two-factor authentication'>
              <RegistryIcon lucide='HelpCircleIcon' aria-hidden='true' className='size-3.5' />
            </TooltipTrigger>
            <TooltipContent side='right'>Requires a verification code on sign-in.</TooltipContent>
          </Tooltip>
        </Row>
        <Row label='AI copilot' defaultChecked>
          <Badge size='sm'>New</Badge>
        </Row>
        <Row label='Smart suggestions'>
          <Badge variant='secondary' size='sm'>
            Beta
          </Badge>
        </Row>
        <Row label='Disabled (Unchecked)' disabled />
        <Row label='Disabled (Checked)' defaultChecked disabled />
      </div>
    </TooltipProvider>
  );
}
