import Button from '../../../../../components/core/Button';
import { Alert, AlertDescription, AlertTitle } from '../../../../../components/core/Banner/index.js';
import { useOnlineStatus } from '../../../../../hooks/environment/use-online-status.js';

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

export { PublishBar };
