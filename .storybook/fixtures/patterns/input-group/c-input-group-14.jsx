import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <InputGroup>
        <InputGroupInput
          aria-label='Amount'
          type='number'
          defaultValue='5000'
        />
        <InputGroupAddon align='inline-end'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  aria-label='More information'
                  variant='ghost'
                  size='icon-xs'
                >
                  <RegistryIcon lucide='InfoIcon' />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Monthly request limit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
