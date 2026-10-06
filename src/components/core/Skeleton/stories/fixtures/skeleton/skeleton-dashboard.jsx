import {
  CardRoot as Card,
  CardContent,
  CardHeader
} from '@gaudi/design-system/core/Card';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
const rows = ['w-3/4', 'w-2/3', 'w-5/6', 'w-1/2'];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-3'>
      <div className='grid grid-cols-3 gap-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className='pb-2'>
              <Skeleton className='h-3 w-16' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <Skeleton className='h-7 w-20' />
              <Skeleton className='h-3 w-full' />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className='flex flex-col gap-3'>
          <div className='border-ui-border flex gap-4 border-b pb-2'>
            <Skeleton className='h-4 flex-1' />
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-4 w-16' />
          </div>
          {rows.map((width) => (
            <div key={width} className='flex items-center gap-4'>
              <div className='flex flex-1 items-center gap-2'>
                <Skeleton className='size-6 shrink-0 rounded-full' />
                <Skeleton className={`h-3.5 ${width}`} />
              </div>
              <Skeleton className='h-3.5 w-20' />
              <Skeleton className='h-5 w-16 rounded-full' />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
