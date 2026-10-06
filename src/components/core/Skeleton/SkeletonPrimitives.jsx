import { cn } from '../../../utilities/cn/index.js';
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
