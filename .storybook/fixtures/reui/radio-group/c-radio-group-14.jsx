// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <TooltipProvider>
      <RadioGroup defaultValue='public' className='w-full max-w-xs'>
        <Field orientation='horizontal'>
          <RadioGroupItem value='public' id='vis-public' />
          <div className='flex items-center gap-1.5'>
            <FieldLabel htmlFor='vis-public'>Public</FieldLabel>
            <Tooltip>
              <TooltipTrigger className='text-ui-muted-foreground'>
                <span>
                  <RegistryIcon
                    lucide='HelpCircleIcon'
                    aria-hidden='true'
                    className='size-3.5'
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent side='right'>
                Anyone on the internet can see this.
              </TooltipContent>
            </Tooltip>
          </div>
        </Field>
        <Field orientation='horizontal'>
          <RadioGroupItem value='private' id='vis-private' />
          <div className='flex items-center gap-1.5'>
            <FieldLabel htmlFor='vis-private'>Private</FieldLabel>
            <Tooltip>
              <TooltipTrigger className='text-ui-muted-foreground'>
                <RegistryIcon
                  lucide='HelpCircleIcon'
                  aria-hidden='true'
                  className='size-3.5'
                />
              </TooltipTrigger>
              <TooltipContent side='right'>
                Only you and collaborators can access this.
              </TooltipContent>
            </Tooltip>
          </div>
        </Field>
      </RadioGroup>
    </TooltipProvider>
  );
}
