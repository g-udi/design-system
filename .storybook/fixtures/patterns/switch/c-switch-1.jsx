import { Badge } from '../../../../src/components/core/Pill/parts/badge.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

function Row({ id, label, children, ...props }) {
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
        <Row id='sw-airplane' label='Airplane mode' />
        <Row id='sw-2fa' label='Two-factor authentication' defaultChecked>
          <Tooltip>
            <TooltipTrigger className='text-text-muted' aria-label='About two-factor authentication'>
              <RegistryIcon lucide='HelpCircleIcon' aria-hidden='true' className='size-3.5' />
            </TooltipTrigger>
            <TooltipContent side='right'>Requires a verification code on sign-in.</TooltipContent>
          </Tooltip>
        </Row>
        <Row id='sw-copilot' label='AI copilot' defaultChecked>
          <Badge className='h-4.5 rounded-control px-1.5 text-xs tracking-wider uppercase'>New</Badge>
        </Row>
        <Row id='sw-suggestions' label='Smart suggestions'>
          <Badge variant='secondary' className='h-4.5 rounded-control px-1.5 text-xs tracking-wider uppercase'>
            Beta
          </Badge>
        </Row>
        <Row id='sw-disabled-off' label='Disabled (Unchecked)' disabled />
        <Row id='sw-disabled-on' label='Disabled (Checked)' defaultChecked disabled />
      </div>
    </TooltipProvider>
  );
}
