import { cn } from '../../../utilities/cn/index.js';
import { Badge } from '../../core/Pill/Badge.jsx';
import { Loader } from '../../core/Loader/LoaderPrimitives.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

/*
 * One status vocabulary for tools, reasoning steps, delegations and plans:
 * pending (queued), running (in progress), done and failed. `cancelled` reads as a skipped step;
 * `awaiting` and `denied` belong to tool calls that need the person's approval.
 */
const messageStatuses = Object.freeze({
  pending: { label: 'Queued', icon: 'CircleDashed', tone: 'text-text-muted', badge: 'outline' },
  running: { label: 'Running', icon: null, tone: 'text-accent', badge: 'info-light' },
  done: { label: 'Done', icon: 'CircleCheck', tone: 'text-success', badge: 'success-light' },
  failed: { label: 'Failed', icon: 'CircleX', tone: 'text-danger', badge: 'destructive-light' },
  cancelled: { label: 'Skipped', icon: 'Circle', tone: 'text-text-muted', badge: 'outline' },
  // A tool call waiting on the person (ChatMessageToolApproval), and one they refused.
  awaiting: { label: 'Needs approval', icon: 'ShieldQuestionMark', tone: 'text-warning', badge: 'warning-light' },
  denied: { label: 'Denied', icon: 'Ban', tone: 'text-danger', badge: 'destructive-light' }
});

const statusOf = (status) => messageStatuses[status] || messageStatuses.pending;

function ChatMessageStatusIcon({ status = 'pending', className }) {
  const meta = statusOf(status);
  if (!meta.icon) return <Loader aria-hidden='true' aria-label={undefined} role={undefined} className={cn('size-3.5 shrink-0', meta.tone, className)} />;
  return <RegistryIcon lucide={meta.icon} className={cn('size-3.5 shrink-0', meta.tone, className)} />;
}

/** A labelled status badge; `labels` overrides the words for each status. */
function ChatMessageStatus({ status = 'pending', labels, className }) {
  const meta = statusOf(status);
  return (
    <Badge data-slot='message-status' data-status={status} variant={meta.badge} size='sm' className={cn('gap-1', className)}>
      <ChatMessageStatusIcon status={status} className='size-3' />
      {labels?.[status] || meta.label}
    </Badge>
  );
}

export { ChatMessageStatus, ChatMessageStatusIcon, messageStatuses };
