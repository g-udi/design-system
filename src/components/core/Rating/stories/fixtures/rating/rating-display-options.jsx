import { Rating } from '@gaudi/design-system/core/Rating';

const rows = [
  { label: 'Whole score', props: { rating: 4 } },
  { label: 'Partial star', props: { rating: 3.5 } },
  { label: 'With value', props: { rating: 4.5, showValue: true } },
  { label: 'Small', props: { rating: 4, size: 'sm' } },
  { label: 'Large', props: { rating: 4, size: 'lg' } }
];

export function Pattern() {
  return (
    <dl className='mx-auto grid w-full max-w-xs gap-2'>
      {rows.map(({ label, props }) => (
        <div key={label} className='flex min-h-7 items-center justify-between gap-3'>
          <dt className='text-xs text-text-muted'>{label}</dt>
          <dd>
            <Rating {...props} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
