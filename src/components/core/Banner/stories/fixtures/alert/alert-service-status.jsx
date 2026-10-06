import { useState } from 'react';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle
} from '@gaudi/design-system/core/Banner';
import {
  Frame,
  FramePanel
} from '@gaudi/design-system/core/Card';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const flush = 'rounded-none border-0 bg-transparent shadow-none';

export function Pattern() {
  const [retried, setRetried] = useState(false);
  return (
    <div className='mx-auto w-full max-w-lg'>
      <Frame stacked>
        <FramePanel className='overflow-hidden p-0!'>
          <Alert variant='success' className={flush}>
            <RegistryIcon lucide='DatabaseIcon' />
            <AlertTitle>Database connected</AlertTitle>
            <AlertDescription>All systems operational. Last sync 2 minutes ago.</AlertDescription>
          </Alert>
        </FramePanel>
        <FramePanel className='overflow-hidden p-0!'>
          <Alert variant={retried ? 'success' : 'warning'} className={flush}>
            <RegistryIcon lucide='GlobeIcon' />
            <AlertTitle>{retried ? 'API connection restored' : 'API latency warning'}</AlertTitle>
            <AlertAction>
              <Button size='xs' variant='outline' disabled={retried} onClick={() => setRetried(true)}>
                <RegistryIcon lucide='RefreshCwIcon' className='size-3' />
                Retry
              </Button>
            </AlertAction>
            <AlertDescription>{retried ? 'The simulated retry succeeded. No service request was sent.' : 'Increased latency in US-East. Our engineers are investigating.'}</AlertDescription>
          </Alert>
        </FramePanel>
        <FramePanel className='overflow-hidden p-0!'>
          <Alert variant='info' className={flush}>
            <RegistryIcon lucide='InfoIcon' />
            <AlertTitle>Resource limit reached</AlertTitle>
            <AlertAction>
              <Button href='/settings/billing' size='xs'>Upgrade</Button>
            </AlertAction>
            <AlertDescription>Your plan has reached its build minutes for this month.</AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}
