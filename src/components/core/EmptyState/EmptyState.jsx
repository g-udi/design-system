import { cn } from '../../../utilities/cn';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './Empty.jsx';

/** Prop-driven empty state built from the composition parts; `compact` tightens it for small panels. */
export default function EmptyState({
  title,
  description,
  icon,
  actions,
  compact = false,
  titleAs = 'div',
  className,
  ...props
}) {
  return (
    <Empty {...props} data-compact={compact || undefined} className={cn(compact ? 'px-3 py-4' : 'px-4 py-8', className)}>
      <EmptyHeader>
        {icon && <EmptyMedia variant='icon' aria-hidden='true'>{icon}</EmptyMedia>}
        <EmptyTitle as={titleAs}>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {actions && <EmptyContent className='flex-row flex-wrap justify-center gap-2'>{actions}</EmptyContent>}
    </Empty>
  );
}
