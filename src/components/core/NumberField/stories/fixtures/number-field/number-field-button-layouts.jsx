import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea
} from '@gaudi/design-system/core/NumberField';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-lg gap-3 sm:grid-cols-3'>
      {/* Split: decrement and increment on either side. */}
      <NumberField defaultValue={5} min={0} max={100}>
        <NumberFieldScrubArea label='Quantity' />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      {/* Both buttons trail the value. */}
      <NumberField defaultValue={12} min={1} max={50}>
        <NumberFieldScrubArea label='Seats' />
        <NumberFieldGroup>
          <NumberFieldInput className='text-start' />
          <NumberFieldDecrement className='rounded-none!' />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      {/* Stacked spinner chevrons. */}
      <NumberField defaultValue={3} min={1} max={10}>
        <NumberFieldScrubArea label='Replicas' />
        <NumberFieldGroup>
          <NumberFieldInput className='text-start' />
          <div className='m-px flex shrink-0 flex-col overflow-hidden rounded-md border border-border bg-surface-muted'>
            <NumberFieldIncrement className='flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! border-b border-border px-1.5 leading-none'>
              <RegistryIcon lucide='ChevronUpIcon' className='size-3.5' />
            </NumberFieldIncrement>
            <NumberFieldDecrement className='flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none'>
              <RegistryIcon lucide='ChevronDownIcon' className='size-3.5' />
            </NumberFieldDecrement>
          </div>
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}
