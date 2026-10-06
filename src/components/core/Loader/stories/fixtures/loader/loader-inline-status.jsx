import { ChatActivityIndicator } from '@gaudi/design-system/chat/ChatActivityIndicator';
import { LoaderRoot as Loader } from '@gaudi/design-system/core/Loader';
const statuses = [
  { tone: 'text-text-muted', title: 'Checking availability', detail: '' },
  { tone: 'text-accent', title: 'Publishing', detail: 'step 2 of 3' },
  { tone: 'text-success', title: 'Connected', detail: 'syncing data' },
  { tone: 'text-warning', title: 'Reconnecting', detail: 'attempt 3 of 5' },
  { tone: 'text-danger', title: 'Retrying', detail: 'upload failed once' },
  { tone: 'text-info', title: 'Indexing', detail: '1,204 files' }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col gap-2'>
      {statuses.map(({ tone, title, detail }) => (
        <div key={title} className='flex items-center gap-2 text-sm'>
          <Loader className={`size-3.5 ${tone}`} aria-label={title} />
          <span className={`font-medium ${tone}`}>{title}</span>
          {detail ? <span className='text-text-muted'>· {detail}</span> : null}
        </div>
      ))}
      <div className='flex items-center gap-2 text-sm'>
        <ChatActivityIndicator state='streaming' labels={{ streaming: 'Typing' }} />
        <span className='text-text-muted'>Alex is typing</span>
      </div>
    </div>
  );
}
