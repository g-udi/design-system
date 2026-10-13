import { Separator } from '@gaudi/design-system/core/Separator';
import Link from '@gaudi/design-system/core/Link';

const sections = [
  { title: 'Settings', hint: 'Manage preferences' },
  { title: 'Account', hint: 'Profile and security' },
  { title: 'Help', hint: 'Support and docs' }
];

export function Pattern() {
  return (
    <div className='flex flex-col items-center gap-3 text-sm'>
      {/* Vertical rules stretch to the height of a flex row. */}
      <nav aria-label='Resources' className='flex h-5 items-center gap-3'>
        <Link href='#blog' variant='bare' className='hover:underline'>Blog</Link>
        <Separator orientation='vertical' />
        <Link href='#docs' variant='bare' className='hover:underline'>Docs</Link>
        <Separator orientation='vertical' />
        <Link href='#source' variant='bare' className='hover:underline'>Source</Link>
      </nav>
      {/* A fixed height keeps the rules shorter than two-line items. */}
      <div className='flex items-center gap-3'>
        {sections.map((section, index) => (
          <div key={section.title} className='flex items-center gap-3'>
            {index > 0 && <Separator orientation='vertical' className='h-6 [&]:self-auto!' />}
            <div className='flex flex-col gap-0.5'>
              <span className='font-medium'>{section.title}</span>
              <span className='text-xs text-ui-muted-foreground'>{section.hint}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
