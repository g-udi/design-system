'use client';
import { useFieldLabel } from '../Field/Label.jsx';
import { cn } from '../../../utilities/cn/index.js';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
function RadioGroup({ className, ...props }) {
  return (
    <RadioGroupPrimitive.Root
      data-slot='radio-group'
      className={cn('ds-part-radio-group w-full', className)}
      {...props}
    />
  );
}
function RadioGroupItem({ className, ...props }) {
  const labelId = useFieldLabel();
  return (
    <RadioGroupPrimitive.Item
      data-slot='radio-group-item'
      aria-labelledby={props['aria-label'] ? undefined : labelId}
      className={cn(
        'ds-part-radio-group-item group/radio-group-item peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot='radio-group-indicator'
        className='ds-part-radio-group-indicator'
      >
        <span className='ds-part-radio-group-indicator-icon' />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
export { RadioGroup, RadioGroupItem };
