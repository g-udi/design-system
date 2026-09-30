// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { cn } from '../../../../utilities/cn/index.js';
function Kbd({ className, ...props }) {
  return (
    <kbd
      data-slot='kbd'
      className={cn(
        'ds-part-kbd pointer-events-none inline-flex items-center justify-center select-none',
        className
      )}
      {...props}
    />
  );
}
function KbdGroup({ className, ...props }) {
  return (
    <kbd
      data-slot='kbd-group'
      className={cn('ds-part-kbd-group inline-flex items-center', className)}
      {...props}
    />
  );
}
export { Kbd, KbdGroup };
