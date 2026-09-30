import { cn } from '../../../utilities/cn';

export default function EmptyState({
  title,
  description,
  icon,
  actions,
  compact = false,
  className,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn('ds-empty', compact && 'ds-empty-compact', className)}
    >
      {icon && (
        <span aria-hidden='true' className='ds-empty-icon'>
          {icon}
        </span>
      )}
      <p className='ds-title'>{title}</p>
      {description && <p className='ds-description'>{description}</p>}
      {actions && <div className='ds-actions'>{actions}</div>}
    </div>
  );
}
