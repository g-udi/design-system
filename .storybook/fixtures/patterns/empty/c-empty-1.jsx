import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '../../../../src/components/core/EmptyState/parts/empty.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any projects yet. Get started by creating
            your first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className='flex gap-2'>
            <Button asChild>
              <a href='#'>Create project</a>
            </Button>
            <Button variant='outline'>Import project</Button>
          </div>
          <Button variant='link' asChild className='text-ui-muted-foreground'>
            <a href='#'>
              Learn more <RegistryIcon lucide='ArrowUpRightIcon' />
            </a>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
