import { expect, waitFor, within } from 'storybook/test';
import Button from '../../components/core/Button';
import { Alert, AlertDescription, AlertTitle } from '../../components/core/Banner/index.js';
import { example, hookMeta } from '../story-helpers.jsx';
import { useOnlineStatus } from './use-online-status.js';

export default {
  title: 'Hooks/Environment/useOnlineStatus',
  id: 'hooks-environment-useonlinestatus',
  tags: ['autodocs'],
  ...hookMeta('useOnlineStatus')
};

function PublishBar() {
  const online = useOnlineStatus();
  return (
    <div className='grid gap-3'>
      {online ? null : (
        <Alert variant='warning'>
          <AlertTitle>You are offline</AlertTitle>
          <AlertDescription>Your edits are kept on this device. Publishing comes back when the connection does.</AlertDescription>
        </Alert>
      )}
      <div className='flex gap-2'>
        <Button variant='outline' tone='neutral'>Keep editing</Button>
        <Button disabled={!online}>Publish</Button>
      </div>
    </div>
  );
}

export const OfflineNotice = {
  name: 'Offline notice',
  parameters: example('Going offline shows an Alert (announced when it appears) and disables only the action that needs the network; editing continues. Toggle offline in the browser developer tools to try it.', `
import { Alert, AlertDescription, AlertTitle, Button } from '@gaudi/design-system';
import { useOnlineStatus } from '@gaudi/design-system/hooks';

export function PublishBar() {
  const online = useOnlineStatus();
  return (
    <>
      {!online && <Alert variant='warning'><AlertTitle>You are offline</AlertTitle><AlertDescription>Your edits are kept on this device.</AlertDescription></Alert>}
      <Button disabled={!online}>Publish</Button>
    </>
  );
}`),
  render: () => <PublishBar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Publish' })).toBeEnabled();
    Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => false });
    window.dispatchEvent(new Event('offline'));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Publish' })).toBeDisabled());
    await expect(canvas.getByText('You are offline')).toBeVisible();
    delete navigator.onLine;
    window.dispatchEvent(new Event('online'));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Publish' })).toBeEnabled());
  }
};
