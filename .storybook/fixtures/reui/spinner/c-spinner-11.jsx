// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
export function Pattern() {
  return (
    <Card className='relative w-full max-w-xs'>
      <CardContent className='space-y-3 p-4'>
        <h3 className='text-sm font-semibold'>Dashboard Overview</h3>
        <p className='text-ui-muted-foreground text-sm'>
          Monthly revenue and user statistics for the current period.
        </p>
        <div className='grid grid-cols-2 gap-4'>
          <div className='rounded-md border p-3'>
            <p className='text-ui-muted-foreground text-xs'>Revenue</p>
            <p className='text-lg font-bold'>$12,450</p>
          </div>
          <div className='rounded-md border p-3'>
            <p className='text-ui-muted-foreground text-xs'>Users</p>
            <p className='text-lg font-bold'>1,234</p>
          </div>
        </div>
      </CardContent>

      {/* Overlay */}
      <Card className='bg-ui-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs'>
        <CardContent className='flex grow flex-col items-center justify-center gap-2'>
          <Spinner className='size-4 opacity-60' />
        </CardContent>
      </Card>
    </Card>
  );
}
