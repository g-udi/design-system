import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useState } from 'react';
import Commander from '@gaudi/design-system/core/Commander';
import { MenuSearch } from '@gaudi/design-system/blocks/Navigation';
import Pill from '@gaudi/design-system/core/Pill';
import Icon from '@gaudi/design-system/core/Icon';

export const collectionLabels = [
  ['posts', 'Posts', 'FileText'],
  ['projects', 'Projects', 'Folder'],
  ['thoughts', 'Thoughts', 'Lightbulb'],
  ['publications', 'Publications', 'BookOpen'],
  ['tags', 'Tags', 'Tag']
];
export const indexedLabel = (label, count) => `${label}: ${count}`;

// A site header with a search field that opens the launcher, and the indexed collections underneath.
export function HeaderExample(props) {
  const [open, setOpen] = useState(false);
  return (
    <div className='mx-auto grid w-full max-w-xl gap-3'>
      <header className='flex items-center gap-3 rounded-lg border border-border px-3 py-2'>
        <span className='inline-flex items-center gap-2'><GaudiBrand className='text-sm' /></span>
        <nav aria-label='Site' className='hidden gap-3 text-sm text-text-muted sm:flex'>
          <span>Blog</span>
          <span>Projects</span>
          <span>About</span>
        </nav>
        <MenuSearch className='ms-auto' setOpen={setOpen} />
      </header>
      <ul aria-label='Indexed collections' className='flex flex-wrap justify-center gap-1.5'>
        {collectionLabels.map(([key, label, icon]) => {
          const count = props[key]?.length || 0;
          return (
            <li key={key}>
              <Pill tone={count ? 'blue' : 'gray'} variant={count ? 'soft' : 'outline'} size='sm' radius='full' icon={<Icon name={icon} decorative size='xs' />}>
                <span className='sr-only'>{indexedLabel(label, count)}</span>
                <span aria-hidden='true' className={count ? undefined : 'line-through'}>{label} · {count}</span>
              </Pill>
            </li>
          );
        })}
      </ul>
      <Commander open={open} setOpen={setOpen} {...props} />
    </div>
  );
}
