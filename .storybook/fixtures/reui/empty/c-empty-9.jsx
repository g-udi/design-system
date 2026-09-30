// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center p-4'>
      <Empty className='bg-ui-muted py-16'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <RegistryIcon lucide='BellOffIcon' />
          </EmptyMedia>
          <EmptyTitle>No notifications</EmptyTitle>
          <EmptyDescription>
            When you get notifications, they&apos;ll show up here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
