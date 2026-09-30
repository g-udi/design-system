// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { cn } from '../../../../utilities/cn/index.js';
function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot='skeleton'
      className={cn('ds-part-skeleton animate-pulse', className)}
      {...props}
    />
  );
}
export { Skeleton };
