import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
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
          <Spinner className={`size-3.5 ${tone}`} aria-label={title} />
          <span className={`font-medium ${tone}`}>{title}</span>
          {detail ? <span className='text-text-muted'>· {detail}</span> : null}
        </div>
      ))}
      <div className='flex items-center gap-2 text-sm'>
        <span role='status' aria-label='Typing' className='flex w-3.5 items-center justify-center gap-0.5'>
          <span className='size-1 animate-pulse rounded-full bg-text-muted [animation-delay:-0.8s]' />
          <span className='size-1 animate-pulse rounded-full bg-text-muted [animation-delay:-0.4s]' />
          <span className='size-1 animate-pulse rounded-full bg-text-muted' />
        </span>
        <span className='text-text-muted'>Alex is typing</span>
      </div>
    </div>
  );
}
