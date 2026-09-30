'use client';

import { cn } from '../../../utilities/cn';
import { ToggleGroup as ToggleGroupRoot, ToggleGroupItem } from './parts/toggle-group.jsx';

/** Options-driven toggle group: an attached, outlined set of items built from the composition parts.
 *  Items wrap in narrow containers instead of overflowing. */
export default function ToggleGroup({
  label,
  options = [],
  type = 'single',
  variant = 'outline',
  spacing = 0,
  className,
  ...props
}) {
  return (
    <ToggleGroupRoot {...props} type={type} variant={variant} spacing={spacing} aria-label={label} className={cn('max-w-full flex-wrap', className)}>
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          aria-label={option.ariaLabel}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroupRoot>
  );
}
