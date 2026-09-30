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
      <Empty className='bg-ui-muted py-10'>
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
