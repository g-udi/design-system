import { Badge } from '@gaudi/design-system/core/Pill';
const sizes = ['xs', 'sm', 'default', 'lg', 'xl'];
const rows = [
  { label: 'Count', content: '3' },
  { label: 'Label', content: 'New' },
  { label: 'Light', content: 'Beta', variant: 'success-light' },
  { label: 'Outline', content: '12', variant: 'outline' }
];
export function Pattern() {
  return (
    <div className='mx-auto grid w-fit grid-cols-[auto_repeat(5,auto)] items-center gap-x-1 gap-y-2 sm:grid-cols-[auto_repeat(5,minmax(2.5rem,auto))] sm:gap-x-3'>
      <span />
      {sizes.map((size) => (
        <span key={size} className='text-center text-xs text-text-muted'>{size}</span>
      ))}
      {rows.map(({ label, content, variant }) => (
        <div key={label} className='contents'>
          <span className='text-xs text-text-muted'>{label}</span>
          {sizes.map((size) => (
            <span key={size} className='flex justify-center'>
              <Badge size={size} variant={variant}>{content}</Badge>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
