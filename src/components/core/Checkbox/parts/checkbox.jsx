// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useFieldLabel } from '../../Field/parts/label.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function Checkbox({ className, ...props }) {
  const labelId = useFieldLabel();
  return (
    <CheckboxPrimitive.Root
      data-slot='checkbox'
      aria-labelledby={props['aria-label'] ? undefined : labelId}
      className={cn(
        'ds-part-checkbox peer relative shrink-0 outline-none after:absolute after:inset-x-0 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        className='ds-part-checkbox-indicator grid place-content-center text-current transition-none'
      >
        <RegistryIcon lucide='CheckIcon' />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
export { Checkbox };
