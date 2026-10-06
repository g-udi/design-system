import { Rating } from '@gaudi/design-system/core/Rating';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { Separator } from '@gaudi/design-system/core/Separator';
const distribution = [
  { stars: 5, count: 124 },
  { stars: 4, count: 45 },
  { stars: 3, count: 18 },
  { stars: 2, count: 8 },
  { stars: 1, count: 5 }
];
const reviewCount = distribution.reduce((sum, row) => sum + row.count, 0);
const average = distribution.reduce((sum, row) => sum + row.stars * row.count, 0) / reviewCount;

export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-xs space-y-3'>
      <div className='flex flex-col items-center gap-2'>
        <span className='text-3xl font-semibold'>{average.toFixed(1)}</span>
        <Rating rating={average} size='sm' />
        <span className='text-text-muted text-xs'>
          Based on {reviewCount} reviews
        </span>
      </div>
      <Separator />
      <div className='space-y-2'>
        {distribution.map((row) => (
          <div key={row.stars} className='flex items-center gap-3 text-sm'>
            <span className='text-text-muted w-3 text-right text-xs'>
              {row.stars}
            </span>
            <Progress
              value={row.count / reviewCount * 100} aria-label={`${row.stars} star reviews`}
              className='h-1.5 flex-1 **:data-[slot=progress-indicator]:bg-warning'
            />
            <span className='text-text-muted w-7 text-right text-xs'>
              {row.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
