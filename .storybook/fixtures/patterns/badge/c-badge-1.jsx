import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
const tones = ['primary', 'destructive', 'success', 'info', 'warning'];
const rows = [
  { label: 'Solid', variants: ['default', 'secondary', 'destructive', 'success', 'info', 'warning'] },
  { label: 'Light', variants: tones.map((tone) => `${tone}-light`) },
  { label: 'Outline', variants: ['outline', ...tones.map((tone) => `${tone}-outline`)] }
];
const name = (variant) => variant.replace(/-(light|outline)$/, '').replace('default', 'primary');
export function Pattern() {
  return (
    <div className='mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2'>
      {rows.map(({ label, variants }) => (
        <div key={label} className='contents'>
          <span className='text-xs text-text-muted'>{label}</span>
          <div className='flex flex-wrap items-center gap-2'>
            {variants.map((variant) => (
              <Badge key={variant} variant={variant} className='capitalize'>
                {name(variant)}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
