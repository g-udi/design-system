// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
    <div className='flex items-center justify-center p-4'>
      <Empty className='border py-8'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <RegistryIcon lucide='BarChart3Icon' />
          </EmptyMedia>
          <EmptyTitle>No data yet</EmptyTitle>
          <EmptyDescription>
            Once your project starts receiving traffic, analytics will appear
            here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className='flex gap-2'>
            <Button size='sm'>Connect Data Source</Button>
            <Button variant='outline' size='sm'>
              View Docs
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
