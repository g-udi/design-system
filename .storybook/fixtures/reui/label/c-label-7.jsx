// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
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
      <Label htmlFor='label-tooltip' className='gap-1'>
        API Key
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className='inline-flex items-center'>
              <span className='text-ui-muted-foreground inline-flex cursor-help'>
                <RegistryIcon lucide='InfoIcon' className='size-3.5' />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your API key can be found in the developer settings.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Input
        id='label-tooltip'
        placeholder='sk_live_...'
        className='font-mono'
      />
    </Field>
  );
}
