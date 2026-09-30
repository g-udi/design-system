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
export function Pattern() {
  return (
    <div className='mx-auto mb-auto w-full max-w-lg'>
      <Frame stacked>
        <FramePanel className='overflow-hidden p-0!'>
          <Alert
            variant='success'
            className='border-0 bg-transparent shadow-none'
          >
            <RegistryIcon lucide='DatabaseIcon' />
            <AlertTitle>Database Connected</AlertTitle>
            <AlertDescription>
              All systems operational. Last sync: 2 minutes ago.
            </AlertDescription>
          </Alert>
        </FramePanel>
        <FramePanel className='overflow-hidden p-0!'>
          <Alert
            variant='warning'
            className='border-0 bg-transparent shadow-none'
          >
            <RegistryIcon lucide='GlobeIcon' />
            <AlertTitle>API Latency Warning</AlertTitle>
            <AlertAction>
              <Button size='xs' variant='outline' className='h-7'>
                <RegistryIcon lucide='RefreshCwIcon' className='mr-1 size-3' />
                Retry
              </Button>
            </AlertAction>
            <AlertDescription>
              Increased latency detected in US-East regions. Our engineers are
              investigating.
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}
