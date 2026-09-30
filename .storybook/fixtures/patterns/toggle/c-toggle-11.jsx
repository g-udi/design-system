'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Toggle } from '../../../../src/components/core/ToggleGroup/parts/toggle.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// Each reaction adds one to its count while pressed.
const reactions = [
  { label: 'Like', icon: 'HeartIcon', count: 12 },
  { label: 'Repost', icon: 'Repeat2Icon', count: 5 },
  { label: 'Share', icon: 'Share2Icon', count: 3 },
  { label: 'Bookmark', icon: 'BookmarkIcon', count: 8 }
];

export function Pattern() {
  const [pressed, setPressed] = useState({});
  const [read, setRead] = useState(false);
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {reactions.map(({ label, icon, count }) => (
        <Toggle key={label} variant='outline' size='sm' aria-label={label} pressed={Boolean(pressed[label])} onPressedChange={(on) => setPressed((p) => ({ ...p, [label]: on }))}>
          <RegistryIcon lucide={icon} className='group-data-[state=on]/toggle:fill-current' />
          <span className='tabular-nums'>{count + (pressed[label] ? 1 : 0)}</span>
        </Toggle>
      ))}
      <Toggle aria-label={read ? 'Notifications' : 'Notifications (3 unread)'} pressed={read} onPressedChange={setRead} className='relative'>
        <RegistryIcon lucide='BellIcon' />
        {!read && (
          <Badge variant='destructive' size='xs' className='absolute -top-1 -right-1 px-1' aria-hidden='true'>3</Badge>
        )}
      </Toggle>
    </div>
  );
}
