import { useState } from 'react';
import Button from '../../../../../components/core/Button';
import Pill from '../../../../../components/core/Pill';
import { usePrevious } from '../../../../../hooks/state/use-previous.js';

function SubscriberTrend() {
  const [ subscribers, setSubscribers ] = useState(4180);
  const previous = usePrevious(subscribers);
  const change = previous === undefined ? 0 : subscribers - previous;
  const trend = change > 0 ? `up ${change}` : change < 0 ? `down ${Math.abs(change)}` : 'no change yet';
  return (
    <div className='grid gap-3'>
      <p className='flex flex-wrap items-center gap-2 text-2xl font-semibold tabular-nums'>
        {subscribers.toLocaleString('en-US')}
        <Pill size='sm' variant='soft' tone={change > 0 ? 'green' : change < 0 ? 'red' : 'neutral'}>{trend}</Pill>
      </p>
      <div className='flex gap-2'>
        <Button size='sm' variant='outline' tone='neutral' onClick={() => setSubscribers((count) => count + 25)}>New signups</Button>
        <Button size='sm' variant='outline' tone='neutral' onClick={() => setSubscribers((count) => count - 10)}>Unsubscribes</Button>
      </div>
    </div>
  );
}

export { SubscriberTrend };
