import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Empty className='border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <RegistryIcon lucide='FolderIcon' />
          </EmptyMedia>
          <EmptyTitle>Nothing to see here</EmptyTitle>
          <EmptyDescription>
            No posts have been created yet. Get started by{' '}
            <a href='#'>creating your first post</a>.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant='outline'>
            <RegistryIcon lucide='PlusIcon' data-icon='inline-start' />
            New Post
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
