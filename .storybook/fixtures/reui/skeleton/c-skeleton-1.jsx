// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Skeleton } from '../../../../src/components/core/Skeleton/parts/skeleton.jsx';
export function Pattern() {
  return (
    <div className='flex items-center gap-4'>
      <Skeleton className='h-12 w-12 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[200px]' />
        <Skeleton className='h-4 w-[140px]' />
      </div>
    </div>
  );
}
