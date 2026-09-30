import { AspectRatio } from '../../../../src/components/core/AspectRatio/parts/aspect-ratio.jsx';

// Common media shapes, widest first. Each frame keeps its shape at any column width.
const ratios = [
  { label: '21:9', use: 'Ultrawide banner', ratio: 21 / 9, art: 3 },
  { label: '16:9', use: 'Widescreen video', ratio: 16 / 9, art: 9 },
  { label: '16:10', use: 'Monitor', ratio: 16 / 10, art: 7 },
  { label: '3:2', use: 'Photography', ratio: 3 / 2, art: 2 },
  { label: '4:3', use: 'Standard', ratio: 4 / 3, art: 5 },
  { label: '1:1', use: 'Square', ratio: 1, art: 0 },
  { label: '4:5', use: 'Social portrait', ratio: 4 / 5, art: 6 },
  { label: '9:16', use: 'Story', ratio: 9 / 16, art: 11 }
];

export function Pattern() {
  return (
    <ul className='mx-auto grid w-full max-w-2xl grid-cols-2 items-end gap-3 sm:grid-cols-4'>
      {ratios.map(({ label, use, ratio, art }) => (
        <li key={label} className='flex min-w-0 flex-col gap-1'>
          <AspectRatio ratio={ratio} className='overflow-hidden rounded-lg border border-ui-border bg-ui-muted'>
            <img src={`static/images/art/${art}.svg`} alt={`${label} ${use.toLowerCase()}`} className='size-full object-cover' />
          </AspectRatio>
          <span className='flex items-baseline justify-between gap-2 text-xs'>
            <span className='font-medium text-ui-foreground tabular-nums'>{label}</span>
            <span className='truncate text-ui-muted-foreground'>{use}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
