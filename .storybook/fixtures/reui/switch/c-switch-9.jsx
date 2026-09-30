// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Field orientation='horizontal'>
        <Switch id='sw-tooltip' />
        <div className='flex items-center gap-1.5'>
          <FieldLabel htmlFor='sw-tooltip'>
            Two-factor authentication
          </FieldLabel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='text-ui-muted-foreground'>
                <RegistryIcon
                  lucide='HelpCircleIcon'
                  aria-hidden='true'
                  className='size-3.5'
                />
              </TooltipTrigger>
              <TooltipContent side='right'>
                Adds an extra layer of security by requiring a verification code
                on login.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Field>
    </div>
  );
}
