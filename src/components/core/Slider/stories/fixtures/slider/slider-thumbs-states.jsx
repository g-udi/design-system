import { Slider } from '@gaudi/design-system/core/Slider';

const rows = [
  { label: 'Single', props: { defaultValue: [50], step: 1 } },
  { label: 'Range', props: { defaultValue: [25, 75], step: 5 } },
  { label: 'Three thumbs', props: { defaultValue: [10, 40, 80], step: 10 } },
  { label: 'Disabled', props: { defaultValue: [50], step: 1, disabled: true } }
];

export function Pattern() {
  return (
    <dl className='mx-auto grid w-full max-w-sm gap-3'>
      {rows.map(({ label, props }) => (
        <div key={label} className='grid grid-cols-[6rem_1fr] items-center gap-3'>
          <dt className='text-xs text-text-muted'>{label}</dt>
          <dd className='px-2'>
            <Slider aria-label={label} max={100} {...props} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
