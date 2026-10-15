'use client';
import { cn } from '../../../utilities/cn/index.js';
import { Toggle as TogglePrimitive } from 'radix-ui';
import { toggleVariants } from './toggleVariants.js';
function Toggle({
  className,
  variant = 'default',
  size = 'default',
  ...props
}) {
  return (
    <TogglePrimitive.Root
      data-slot='toggle'
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}
export { Toggle };
