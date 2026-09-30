// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Skeleton } from '../../../../src/components/core/Skeleton/parts/skeleton.jsx';
export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-xs'>
      {/* Skeleton pattern */}
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
        <div className='mt-4 flex flex-col gap-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
        </div>
      </div>
    </div>
  );
}
