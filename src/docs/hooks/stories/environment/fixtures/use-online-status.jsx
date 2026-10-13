import Button from '@gaudi/design-system/core/Button';
import { Alert, AlertDescription, AlertTitle } from '@gaudi/design-system/core/Banner';
import { useOnlineStatus } from '@gaudi/design-system/hooks/environment/use-online-status';

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
