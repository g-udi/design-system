'use client';
import { useFieldLabel } from '../Field/Label.jsx';
import { cn } from '../../../utilities/cn/index.js';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
function Checkbox({ className, ...props }) {
  const labelId = useFieldLabel();
  return (
    <CheckboxPrimitive.Root
      data-slot='checkbox'
      aria-labelledby={props['aria-label'] ? undefined : labelId}
      className={cn(
        'ds-part-checkbox group/checkbox peer relative shrink-0 outline-none after:absolute after:inset-x-0 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        className='ds-part-checkbox-indicator grid place-content-center text-current transition-none'
      >
        <RegistryIcon lucide='CheckIcon' className='group-data-[state=indeterminate]/checkbox:hidden' />
        <RegistryIcon lucide='MinusIcon' className='hidden group-data-[state=indeterminate]/checkbox:block' />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
export { Checkbox };
