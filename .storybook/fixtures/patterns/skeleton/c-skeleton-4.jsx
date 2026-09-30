import { Skeleton } from '../../../../src/components/core/Skeleton/parts/skeleton.jsx';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-xs flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='h-3.5 w-full' />
        <Skeleton className='h-3.5 w-3/4' />
      </div>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-3.5 w-20' />
        <Skeleton className='h-9 w-full' />
      </div>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-3.5 w-24' />
        <Skeleton className='h-20 w-full' />
      </div>
      <div className='flex items-center gap-2'>
        <Skeleton className='size-4 rounded-sm' />
        <Skeleton className='h-3.5 w-40' />
      </div>
      <div className='flex justify-end gap-2'>
        <Skeleton className='h-8 w-20' />
        <Skeleton className='h-8 w-24' />
      </div>
    </div>
  );
}
