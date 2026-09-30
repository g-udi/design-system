import { cn } from '../../../utilities/cn';

/** Values and comparison semantics are prepared by the host, never inferred. */
export default function StatGroup({
  items = [],
  label = 'Summary',
  className
}) {
  return (
    <dl aria-label={label} className={cn('ds-stat-group', className)}>
      {items.map((item) => (
        <div key={item.id}>
          <dt className='ds-description'>{item.label}</dt>
          <dd className='ds-stat-value'>{item.value}</dd>
          {item.detail && (
            <dd className='ds-stat-detail' data-tone={item.tone || 'neutral'}>
              {item.detail}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
