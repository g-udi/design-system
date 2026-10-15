import { cn } from '../../../utilities/cn/index.js';
// `as='span'` keeps a placeholder valid inside text, such as a paragraph or a link.
function Skeleton({ as: Component = 'div', className, ...props }) {
  return (
    <Component
      data-slot='skeleton'
      className={cn('ds-part-skeleton animate-pulse', className)}
      {...props}
    />
  );
}
export { Skeleton };
