import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

/** A turn that failed: what went wrong and a retry. */
function MessageError({ title = 'The reply stopped before it finished.', onRetry, retryLabel = 'Try again', className, children }) {
  return (
    <div data-slot='message-error' role='alert' className={cn('ds-part-message-error border-danger-border bg-danger-subtle grid gap-2 rounded-(--ds-radius-card) border px-3 py-2.5 text-sm', className)}>
      <div className='text-danger flex items-start gap-2 font-medium'>
        <RegistryIcon lucide='TriangleAlert' className='mt-0.5 size-4 shrink-0' />
        <span>{title}</span>
      </div>
      {children ? <div className='text-text-muted ps-6 text-xs'>{children}</div> : null}
      {onRetry ? (
        <div className='ps-6'>
          <Button size='xs' variant='outline' onClick={onRetry}><RegistryIcon lucide='RotateCcw' />{retryLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}

export { MessageError };
