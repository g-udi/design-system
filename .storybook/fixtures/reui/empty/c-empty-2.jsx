// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
      <Empty className='bg-ui-muted'>
        <EmptyHeader>
          <EmptyTitle>No results found</EmptyTitle>
          <EmptyDescription>
            No results found for your search. Try adjusting your search terms.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Try again</Button>
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
