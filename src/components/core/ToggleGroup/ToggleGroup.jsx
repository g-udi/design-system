'use client';

import * as Primitive from '@radix-ui/react-toggle-group';
import { cn } from '../../../utilities/cn';

export default function ToggleGroup({
  label,
  options = [],
  className,
  type = 'single',
  ...props
}) {
  return (
    <Primitive.Root
      {...props}
      type={type}
      aria-label={label}
      className={cn('ds-toggle-group', className)}
    >
      {options.map((option) => (
        <Primitive.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          aria-label={option.ariaLabel}
          className='ds-toggle-item'
        >
          {option.label}
        </Primitive.Item>
      ))}
    </Primitive.Root>
  );
}
