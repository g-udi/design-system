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
    <div className='mx-auto grid w-full max-w-3xl gap-3 sm:grid-cols-2'>
      <Empty className='rounded-lg py-6'>
        <EmptyHeader>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>Get started by creating your first project.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className='flex gap-2'>
            <Button size='sm' asChild>
              <a href='#'>Create project</a>
            </Button>
            <Button size='sm' variant='outline'>Import</Button>
          </div>
          <Button size='sm' variant='link' asChild className='text-ui-muted-foreground'>
            <a href='#'>
              Learn more <RegistryIcon lucide='ArrowUpRightIcon' />
            </a>
          </Button>
        </EmptyContent>
      </Empty>
      <Empty className='bg-ui-muted rounded-lg py-6'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <RegistryIcon lucide='BellOffIcon' />
          </EmptyMedia>
          <EmptyTitle>No notifications</EmptyTitle>
          <EmptyDescription>When you get notifications, they&apos;ll show up here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
      <Empty className='rounded-lg border border-solid py-6'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <RegistryIcon lucide='FolderIcon' />
          </EmptyMedia>
          <EmptyTitle>Nothing to see here</EmptyTitle>
          <EmptyDescription>
            No posts yet. Get started by <a href='#'>creating your first post</a>.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size='sm' variant='outline'>
            <RegistryIcon lucide='PlusIcon' data-icon='inline-start' />
            New post
          </Button>
        </EmptyContent>
      </Empty>
      <Empty className='rounded-lg border border-dashed py-6'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <RegistryIcon lucide='CloudUploadIcon' />
          </EmptyMedia>
          <EmptyTitle>Upload files</EmptyTitle>
          <EmptyDescription>Drag and drop files here, or click to browse.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant='outline' size='sm'>
            <RegistryIcon lucide='PlusIcon' data-icon='inline-start' />
            Browse files
          </Button>
          <EmptyDescription className='text-xs'>PNG, JPG, SVG up to 10MB</EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  );
}
