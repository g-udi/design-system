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
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Empty className='min-h-[300px] w-full max-w-md'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Spinner className='size-4' />
          </EmptyMedia>
          <EmptyTitle>Loading projects</EmptyTitle>
          <EmptyDescription>
            Please wait while we fetch your project data. This should only take
            a moment.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant='outline' disabled>
            Cancel
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
