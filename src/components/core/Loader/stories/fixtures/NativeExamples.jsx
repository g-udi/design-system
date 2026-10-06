import Button from '@gaudi/design-system/core/Button';
import Loader from '@gaudi/design-system/core/Loader';

const saving = 'Saving draft';
// A publish queue: the running task follows the controls; a queued check and a busy button show smaller, quieter loaders.
function Task({ loader, title, detail }) {
  return (
    <li className='flex items-center gap-3 rounded-lg border border-border px-3 py-2.5'>
      <span className='flex min-w-8 shrink-0 items-center justify-center'>{loader}</span>
      <span className='min-w-0 flex-1'>
        <span className='block wrap-anywhere text-sm font-medium text-text'>{title}</span>
        <span className='block text-xs text-text-muted'>{detail}</span>
      </span>
    </li>
  );
}

export function PlaygroundDemo({ size = 'lg', label = 'Publishing article', variant = 'arc' } = {}) {
  const args = { size, label, variant };
  return (
    <div className='grid gap-3'>
      <ul className='m-0 grid list-none gap-2 p-0'>
        <Task loader={<Loader {...args} />} title={args.label} detail='Uploading images · step 2 of 3' />
        <Task loader={<Loader size='sm' label='Checking links' className='text-text-muted' />} title='Checking 14 links' detail='Starts after publishing' />
      </ul>
      <Button variant='outline' size='sm' disabled className='justify-self-end'>
        <Loader size='xs' label={saving} className='text-current' />
        {saving}
      </Button>
    </div>
  );
}

export function LoaderVariants() {
  const variants = ['arc', 'dual-arc', 'bar', 'beat', 'bounce', 'circle-dots', 'clip', 'puff', 'three-dots', 'triangle', 'two-dots'];
  return <ul className='mx-auto grid w-full max-w-4xl list-none grid-cols-2 gap-x-6 gap-y-8 p-0 sm:grid-cols-4 lg:grid-cols-6'>
    {variants.map(variant => <li key={variant} className='flex min-w-0 flex-col items-center gap-2'>
      <div className='grid h-14 place-items-center'><Loader variant={variant} size='lg' label={`${variant} loading example`} /></div>
      <span className='text-center text-xs text-text-muted'>{variant.replaceAll('-', ' ')}</span>
    </li>)}
  </ul>;
}
