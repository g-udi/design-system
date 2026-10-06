import { useState } from 'react';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import Avatar from '@gaudi/design-system/core/Avatar';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';
import DropdownMenu, { DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut } from '@gaudi/design-system/core/DropdownMenu';

// One article's action menu: icons and shortcuts, two toggles, an unavailable action, and a destructive one.
export const article = { title: 'A practical guide to knowledge graphs', author: 'Odile Marchetti', avatar: '/avatars/person-24.svg', meta: 'Draft · edited 2 hours ago' };
export const actions = [
  { label: 'Edit', icon: 'Pencil', shortcut: '⌘E', status: 'Editing the article in this example.' },
  { label: 'Duplicate', icon: 'Copy', shortcut: '⌘D', status: 'Article duplicated in this example.' },
  { label: 'Copy link', icon: 'Link', shortcut: '⌘L' }
];
export const triggerLabel = 'Article actions';
// Toggles keep the menu open so several can be changed in one visit.
const keepOpen = (event) => event.preventDefault();

// Open and non-modal so the menu stays in the docs flow; the stage reserves its height, and `key` reopens it when `align` changes.
export function ActionsExample(args) {
  const [status, setStatus] = useState('');
  const { copy } = useCopyToClipboard({ onCopy: () => setStatus('Article link copied.'), onError: () => setStatus('Copy failed. Choose Copy link to retry.') });
  const [pinned, setPinned] = useState(true);
  const [inFeed, setInFeed] = useState(false);
  return (
    <div className='mx-auto grid min-h-[27.5rem] w-full max-w-md grid-cols-1 content-start gap-2'>
      <article className='flex items-center gap-3 rounded-lg border border-border p-3'>
        <Avatar src={article.avatar} name={article.author} size='sm' shape='circle' alt='' />
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-medium text-text'>{article.title}</p>
          <p className='truncate text-xs text-text-muted'>{pinned ? 'Pinned · ' : ''}{article.meta}</p>
        </div>
        <DropdownMenu
          key={args.align}
          defaultOpen
          modal={false}
          {...args}
          trigger={(
            <Button variant='ghost' tone='neutral' size='sm' aria-label={triggerLabel}>
              <Icon name='EllipsisVertical' decorative size='sm' />
            </Button>
          )}
        >
          <DropdownMenuLabel>Manage article</DropdownMenuLabel>
          {actions.map((action) => (
            <DropdownMenuItem key={action.label} onSelect={() => action.label === 'Copy link' ? copy('https://example.com/articles/knowledge-graphs') : setStatus(action.status)}>
              <Icon name={action.icon} decorative size='sm' />
              {action.label}
              <DropdownMenuShortcut className='ps-6'>{action.shortcut}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={pinned} onCheckedChange={setPinned} onSelect={keepOpen}>Pin to top</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={inFeed} onCheckedChange={setInFeed} onSelect={keepOpen}>Show in feed</DropdownMenuCheckboxItem>
          <DropdownMenuItem disabled>
            <Icon name='Send' decorative size='sm' />
            Publish
            <DropdownMenuShortcut className='ps-6 tracking-normal'>Needs review</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onSelect={() => setStatus('Article archived in this example.')}>
            <Icon name='Archive' decorative size='sm' />
            Archive
          </DropdownMenuItem>
        </DropdownMenu>
      </article>
      <p role='status' className='text-sm text-text-muted'>{status}</p>
    </div>
  );
}
