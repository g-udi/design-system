import Skeleton from '@gaudi/design-system/core/Skeleton';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { useIsClient } from '@gaudi/design-system/hooks/environment/use-is-client';

function LocalTime() {
  const isClient = useIsClient();
  const published = new Date('2026-09-30T08:30:00Z');
  return (
    <div className='grid gap-2'>
      <Readout label='Rendering on the client'><Value>{isClient}</Value></Readout>
      <p className='text-sm'>
        Published at{' '}
        {isClient
          ? <time dateTime={published.toISOString()}>{published.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time>
          : <Skeleton className='inline-block h-4 w-36' aria-hidden='true' />}
        {' '}in your time zone.
      </p>
    </div>
  );
}

export { LocalTime };
