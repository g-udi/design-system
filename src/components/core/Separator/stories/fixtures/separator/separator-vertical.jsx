import { Separator } from '@gaudi/design-system/core/Separator';

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
        <a href='#blog' className='hover:underline'>Blog</a>
        <Separator orientation='vertical' />
        <a href='#docs' className='hover:underline'>Docs</a>
        <Separator orientation='vertical' />
        <a href='#source' className='hover:underline'>Source</a>
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
