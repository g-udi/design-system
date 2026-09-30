import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const flush = 'rounded-none border-0 bg-transparent shadow-none';

export function Pattern() {
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
          <Alert variant='warning' className={flush}>
            <RegistryIcon lucide='GlobeIcon' />
            <AlertTitle>API latency warning</AlertTitle>
            <AlertAction>
              <Button size='xs' variant='outline'>
                <RegistryIcon lucide='RefreshCwIcon' className='size-3' />
                Retry
              </Button>
            </AlertAction>
            <AlertDescription>Increased latency in US-East. Our engineers are investigating.</AlertDescription>
          </Alert>
        </FramePanel>
        <FramePanel className='overflow-hidden p-0!'>
          <Alert variant='info' className={flush}>
            <RegistryIcon lucide='InfoIcon' />
            <AlertTitle>Resource limit reached</AlertTitle>
            <AlertAction>
              <Button size='xs'>Upgrade</Button>
            </AlertAction>
            <AlertDescription>Your plan has reached its build minutes for this month.</AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}
