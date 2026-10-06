import { Badge } from '@gaudi/design-system/core/Pill';
import {
  Item,
  ItemContent,
  ItemMedia
} from '@gaudi/design-system/core/Item';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const CHANGES = [
  { path: 'src/lib/rate-limit.ts', kind: 'added', delta: '+64' },
  { path: 'src/app/api/send/route.ts', kind: 'modified', delta: '+18 -4' },
  { path: 'src/db/schema.ts', kind: 'modified', delta: '+6 -1' },
  { path: 'src/lib/legacy-throttle.ts', kind: 'removed', delta: '-91' },
  { path: 'README.md', kind: 'modified', delta: '+3' }
];
const ICONS = {
  added: <RegistryIcon lucide='PlusIcon' />,
  modified: <RegistryIcon lucide='PencilIcon' />,
  removed: <RegistryIcon lucide='Trash2Icon' />
};
const BADGES = {
  added: 'success-light',
  modified: 'info-light',
  removed: 'destructive-light'
};
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-2'>
      {CHANGES.map((change) => (
        <Item
          key={change.path}
          size='xs'
          className='border-b border-border last:border-b-0'
        >
          <ItemMedia aria-hidden='true' className='size-4 [&_svg]:size-4'>{ICONS[change.kind]}</ItemMedia>
          <ItemContent className='min-w-0 break-words'>
            <span
              className='block truncate font-mono text-xs'
              title={change.path}
            >
              {change.path}
            </span>
          </ItemContent>
          <Badge className='ms-auto' variant={BADGES[change.kind]}>
            {change.kind}
          </Badge>
          <span className='shrink-0 text-xs tabular-nums'>{change.delta}</span>
        </Item>
      ))}
    </div>
  );
}
