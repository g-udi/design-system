// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Marker,
  MarkerContent,
  MarkerIcon
} from '../../../../src/components/core/Marker/parts/marker.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const TOOL_CALLS = [
  {
    id: 'checkout',
    label: 'Checked out fix/rate-limit-window',
    icon: <RegistryIcon lucide='GitBranchIcon' />
  },
  {
    id: 'search',
    label: 'Searched 214 files for rateLimit(',
    icon: <RegistryIcon lucide='SearchIcon' />
  },
  {
    id: 'read',
    label: 'Read src/lib/rate-limit.ts',
    icon: <RegistryIcon lucide='FileTextIcon' />
  },
  {
    id: 'edit',
    label: 'Edited src/lib/rate-limit.ts, 2 hunks',
    icon: <RegistryIcon lucide='PencilIcon' />
  },
  {
    id: 'test',
    label: 'Ran pnpm test rate-limit',
    icon: <RegistryIcon lucide='TerminalIcon' />
  },
  {
    id: 'docs',
    label: 'Read the Upstash quota docs',
    icon: <RegistryIcon lucide='BookOpenIcon' />
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-3'>
      {TOOL_CALLS.map((call) => (
        <Marker key={call.id}>
          <MarkerIcon>{call.icon}</MarkerIcon>
          <MarkerContent>{call.label}</MarkerContent>
        </Marker>
      ))}
    </div>
  );
}
