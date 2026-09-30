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
      <Empty className='py-10'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <RegistryIcon lucide='InboxIcon' />
          </EmptyMedia>
          <EmptyTitle>Inbox zero</EmptyTitle>
          <EmptyDescription>
            You&apos;re all caught up. No new messages.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
