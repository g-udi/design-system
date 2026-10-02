import { expect, within } from 'storybook/test';
import Skeleton from '../../components/core/Skeleton';
import { example, hookMeta, Readout, Value } from '../story-helpers.jsx';
import { useIsClient } from './use-is-client.js';

export default {
  title: 'Hooks/Environment/useIsClient',
  id: 'hooks-environment-useisclient',
  tags: ['autodocs'],
  ...hookMeta('useIsClient')
};

function LocalTime() {
  const isClient = useIsClient();
  const published = new Date('2026-09-30T08:30:00Z');
  return (
    <div className='grid gap-2'>
      <Readout label='Rendering on the client'><Value>{isClient}</Value></Readout>
      <p className='flex items-center gap-2 text-sm'>
        Published at
        {isClient
          ? <time dateTime={published.toISOString()}>{published.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time>
          : <Skeleton className='inline-block h-4 w-36' aria-hidden='true' />}
        in your time zone.
      </p>
    </div>
  );
}

export const LocalisedTime = {
  name: 'Browser-only output',
  parameters: example("The reader's local time zone is unknown on the server, so it renders a same-size placeholder there and the formatted time on the client, without a hydration mismatch.", `
import { Skeleton } from '@gaudi/design-system';
import { useIsClient } from '@gaudi/design-system/hooks';

export function LocalTime({ date }) {
  const isClient = useIsClient();
  return isClient
    ? <time dateTime={date.toISOString()}>{date.toLocaleString()}</time>
    : <Skeleton className='inline-block h-4 w-36' aria-hidden='true' />;
}`),
  render: () => <LocalTime />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('true')).toBeVisible();
  }
};
