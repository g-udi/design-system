import { cn } from '../../../utilities/cn';

export function StatusDot({ className, label, pulse = false, ...props }) {
  return (
    <span
      data-slot='status-dot'
      data-pulse={pulse || undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('relative inline-flex size-1.5 shrink-0 rounded-full bg-current', className)}
      {...props}
    >
      {pulse && (
        <span className='absolute inset-0 rounded-[inherit] bg-inherit opacity-75 motion-safe:animate-ping' />
      )}
    </span>
  );
}
