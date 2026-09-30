'use client';
import { useFieldLabel } from '../../Field/parts/label.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { Switch as SwitchPrimitive } from 'radix-ui';
function Switch({ className, size = 'default', ...props }) {
  const labelId = useFieldLabel();
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      aria-labelledby={props['aria-label'] ? undefined : labelId}
      data-size={size}
      className={cn(
        'ds-part-switch peer group/switch relative inline-flex items-center transition-all outline-none after:absolute after:inset-x-0 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className='ds-part-switch-thumb pointer-events-none block ring-0 transition-transform'
      />
    </SwitchPrimitive.Root>
  );
}
export { Switch };
