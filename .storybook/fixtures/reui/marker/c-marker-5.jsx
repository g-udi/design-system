// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Marker,
  MarkerContent,
  MarkerIcon
} from '../../../../src/components/core/Marker/parts/marker.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
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
      {CHANGES.map((change, index) => (
        <Marker
          key={change.path}
          variant={index < CHANGES.length - 1 ? 'border' : 'default'}
        >
          <MarkerIcon>{ICONS[change.kind]}</MarkerIcon>
          <MarkerContent>
            <span
              className='block truncate font-mono text-xs'
              title={change.path}
            >
              {change.path}
            </span>
          </MarkerContent>
          <Badge className='ms-auto' variant={BADGES[change.kind]}>
            {change.kind}
          </Badge>
          <span className='shrink-0 text-xs tabular-nums'>{change.delta}</span>
        </Marker>
      ))}
    </div>
  );
}
