import { cn } from '../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { Loader as LoaderRoot } from '../../core/Loader/LoaderPrimitives.jsx';
import { Shimmer } from '../../core/Skeleton/Shimmer.jsx';

const DEFAULT_LABELS = {
  idle: 'Ready',
  thinking: 'Thinking',
  streaming: 'Writing a reply',
  tool: 'Using a tool',
  done: 'Done',
  error: 'Something went wrong'
};

// Busy states move; settled states hold still and show an icon, so the state never rests on motion alone.
const settledIcon = { done: 'Check', error: 'TriangleAlert' };
const activityStates = Object.keys(DEFAULT_LABELS);

/**
 * What the assistant is doing right now: idle, thinking, streaming, tool, done or error.
 *
 * - `variant='inline'` is a mark with an optional visible label, for a message header or a status row.
 * - `variant='badge'` is a small dot-sized mark for the corner of an ChatAgentMark or avatar.
 * - `variant='compact'` is a neutral thinking chip with a ray spinner and a changing label.
 *
 * The indicator is a polite status region, so a screen reader hears each change once. Pass `decorative`
 * when a nearby label already names the state. Motion slows to a calm cycle for readers who reduce it.
 */
function ChatActivityIndicator({ state = 'idle', variant = 'inline', showLabel = variant === 'compact', labels: labelOverrides, decorative = false, className, ...props }) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const current = activityStates.includes(state) ? state : 'idle';
  const label = labels[current];
  const icon = settledIcon[current];
  const busy = ['thinking', 'streaming', 'tool'].includes(current);
  return (
    <span
      data-slot='activity-indicator'
      data-state={current}
      data-variant={variant}
      role={decorative ? undefined : 'status'}
      aria-live={decorative ? undefined : 'polite'}
      aria-atomic={decorative ? undefined : true}
      aria-hidden={decorative ? true : undefined}
      className={cn('ds-part-activity-indicator', className)}
      {...props}
    >
      <span aria-hidden='true' className='ds-part-activity-indicator-mark'>
        {icon ? <RegistryIcon lucide={icon} /> : variant === 'compact' ? (
          busy ? <LoaderRoot variant='rays' role={undefined} aria-label={undefined} aria-hidden='true' /> : <RegistryIcon lucide='Circle' />
        ) : (
          <>
            <span className='ds-part-activity-indicator-dot' />
            <span className='ds-part-activity-indicator-dot' />
            <span className='ds-part-activity-indicator-dot' />
          </>
        )}
      </span>
      <span className={cn('ds-part-activity-indicator-label', (!showLabel || variant === 'badge') && 'sr-only')}>
        {variant === 'compact' && showLabel ? (
          <span key={label} className='ds-part-activity-indicator-phase'>
            <Shimmer active={busy} style={{ '--ds-shimmer-base': 'var(--ds-color-text-muted)' }}>{label}</Shimmer>
          </span>
        ) : label}
      </span>
    </span>
  );
}

export { ChatActivityIndicator, activityStates };
