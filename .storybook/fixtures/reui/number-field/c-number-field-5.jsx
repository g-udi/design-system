// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea
} from '../../../../src/components/core/NumberField/parts/number-field-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='w-full max-w-48'>
      <NumberField defaultValue={5} min={0} max={100}>
        <NumberFieldScrubArea label='Amount' />
        <NumberFieldGroup>
          <NumberFieldInput className='text-start' />

          <div className='border-ui-input bg-ui-muted/30 rounded-lg m-px flex shrink-0 flex-col overflow-hidden border'>
            <NumberFieldIncrement className='border-ui-input hover:bg-ui-accent focus-visible:bg-ui-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! border-b px-1.5 leading-none'>
              <RegistryIcon lucide='ChevronUpIcon' className='size-3.5' />
            </NumberFieldIncrement>
            <NumberFieldDecrement className='hover:bg-ui-accent focus-visible:bg-ui-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none'>
              <RegistryIcon lucide='ChevronDownIcon' className='size-3.5' />
            </NumberFieldDecrement>
          </div>
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}
