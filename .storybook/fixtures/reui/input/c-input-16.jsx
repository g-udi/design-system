// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldDescription,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <div className='flex items-center gap-2'>
        <FieldLabel htmlFor='username'>Username</FieldLabel>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className='inline-flex items-center'>
              <RegistryIcon
                lucide='HelpCircleIcon'
                className='text-ui-muted-foreground size-3.5'
              />
            </TooltipTrigger>
            <TooltipContent>
              Your unique identifier on the platform.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input id='username' placeholder='johndoe' />
      <FieldDescription>
        Your unique identifier on the platform.
      </FieldDescription>
    </Field>
  );
}
