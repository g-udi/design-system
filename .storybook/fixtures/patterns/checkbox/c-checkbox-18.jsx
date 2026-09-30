import { useId } from 'react';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const checkboxId = useId();
  return (
    <Field orientation='horizontal' className='w-auto'>
      <Checkbox id={checkboxId} />
      <div className='flex items-center gap-1.5'>
        <FieldLabel htmlFor={checkboxId}>
          Enable advanced analytics
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
              Advanced analytics provides deeper insights into user behavior and
              system performance.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Field>
  );
}
