import {
  CardRoot as Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@gaudi/design-system/core/Card';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs'>
      <CardHeader>
        <Skeleton className='aspect-video w-full' />
      </CardHeader>
      <CardContent className='space-y-2'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-2/3' />
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Skeleton className='h-8 w-20 rounded-md' />
        <Skeleton className='size-8 rounded-md' />
      </CardFooter>
    </Card>
  );
}
