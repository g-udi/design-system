import EmptyState from '../../core/EmptyState';
import Skeleton from '../../core/Skeleton';
import { cn } from '../../../utilities/cn';

export default function ResourceList({
  label = 'Resources',
  items = [],
  renderItem,
  loading = false,
  emptyTitle = 'No resources yet',
  emptyDescription,
  emptyActions,
  className
}) {
  return (
    <div className={cn('ds-resource-list', className)} aria-busy={loading}>
      {loading ? (
        <div role='status' aria-label={`Loading ${label}`} className='ds-stack'>
          <Skeleton className='h-16 w-full' />
          <Skeleton className='h-16 w-full' />
          <Skeleton className='h-16 w-full' />
        </div>
      ) : items.length ? (
        <ul aria-label={label}>
          {items.map((item) => (
            <li key={item.id}>{renderItem(item)}</li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actions={emptyActions}
        />
      )}
    </div>
  );
}
