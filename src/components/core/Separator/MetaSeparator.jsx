import { cn } from '../../../utilities/cn/index.js';

/** A visual middot between adjacent metadata values. */
export function MetaSeparator({ className }) {
  return (
    <span aria-hidden='true' className={cn('text-text-subtle', className)}>
      ·
    </span>
  );
}
