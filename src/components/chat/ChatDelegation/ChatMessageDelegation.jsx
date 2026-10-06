import { cn } from '../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { ChatMessageStatus } from '../shared/message-status.jsx';

/** Work handed to another agent: who took it, the brief, and how it is going. Children carry its activity. */
function ChatMessageDelegation({ agent, status = 'running', instructions, error, labels, className, children }) {
  return (
    <div data-slot='message-delegation' data-status={status} className={cn('ds-part-message-delegation bg-surface grid gap-2 rounded-(--ds-radius-card) border px-3 py-2.5 text-sm', className)}>
      <div className='flex min-w-0 items-center gap-2'>
        <span className='bg-discovery-subtle text-discovery grid size-6 shrink-0 place-items-center rounded-(--ds-radius-control)'>
          <RegistryIcon lucide='Bot' className='size-3.5' />
        </span>
        <span className='min-w-0 flex-1 truncate'>
          <span className='text-text-muted'>{labels?.handedTo || 'Handed to'} </span>
          <span className='font-medium'>{agent?.name}</span>
        </span>
        <ChatMessageStatus status={status} labels={labels} />
      </div>
      {instructions ? <p className='text-text-muted text-xs'>{instructions}</p> : null}
      {error ? <p role='alert' className='text-danger text-xs'>{error}</p> : null}
      {children ? <div className='border-border grid gap-2 border-s-2 ps-3'>{children}</div> : null}
    </div>
  );
}

export { ChatMessageDelegation };
