'use client';
import { cn } from '../../../utilities/cn/index.js';
import { Progress as ProgressPrimitive } from 'radix-ui';
function Progress({ className, value, max = 100, ...props }) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current =
    value == null ? null : Math.min(limit, Math.max(0, Number(value) || 0));
  return (
    <ProgressPrimitive.Root
      data-slot='progress'
      aria-label='Progress'
      value={current}
      max={limit}
      className={cn(
        'ds-part-progress relative flex w-full items-center overflow-x-hidden',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot='progress-indicator'
        className='ds-part-progress-indicator size-full flex-1 transition-all'
        // Indeterminate progress slides via CSS (data-state='indeterminate').
        style={
          current == null
            ? undefined
            : { transform: `translateX(calc(var(--progress-direction, 1) * -${100 - (current / limit) * 100}%))` }
        }
      />
    </ProgressPrimitive.Root>
  );
}
export { Progress };
