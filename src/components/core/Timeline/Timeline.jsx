import { cn } from '../../../utilities/cn';

export default function Timeline({
  items = [],
  label = 'Activity',
  className
}) {
  return (
    <ol aria-label={label} className={cn('ds-timeline', className)}>
      {items.map((item) => (
        <li key={item.id} className='ds-timeline-item'>
          <span className='ds-timeline-mark' aria-hidden='true'>
            {item.icon || <span />}
          </span>
          <div className='ds-timeline-content'>
            <div className='ds-timeline-heading'>
              <span className='ds-label'>{item.title}</span>
              {item.time && (
                <time dateTime={item.dateTime} className='ds-description'>
                  {item.time}
                </time>
              )}
            </div>
            {item.description && (
              <p className='ds-description'>{item.description}</p>
            )}
            {item.children}
          </div>
        </li>
      ))}
    </ol>
  );
}
