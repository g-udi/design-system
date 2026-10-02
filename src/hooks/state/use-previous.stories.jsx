import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Pill from '../../components/core/Pill';
import { example, hookMeta } from '../story-helpers.jsx';
import { usePrevious } from './use-previous.js';

export default {
  title: 'Hooks/State/usePrevious',
  id: 'hooks-state-useprevious',
  tags: ['autodocs'],
  ...hookMeta('usePrevious')
};

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

export const Trend = {
  name: 'Change since the last value',
  parameters: example('The trend compares the current value with the previous one and states the direction in words, not only colour.', `
import { Pill } from '@gaudi/design-system';
import { usePrevious } from '@gaudi/design-system/hooks';

const previous = usePrevious(subscribers);
const change = previous === undefined ? 0 : subscribers - previous;

<Pill tone={change >= 0 ? 'green' : 'red'}>{change >= 0 ? \`up \${change}\` : \`down \${-change}\`}</Pill>`),
  render: () => <SubscriberTrend />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'New signups' }));
    await expect(canvas.getByText('up 25')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Unsubscribes' }));
    await expect(canvas.getByText('down 10')).toBeVisible();
  }
};
