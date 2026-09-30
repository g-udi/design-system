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
      <Frame variant='ghost'>
        <FramePanel className='overflow-hidden p-0!'>
          <Alert variant='info' className='border-0 shadow-none'>
            <RegistryIcon lucide='LightbulbIcon' />
            <AlertTitle>New: Advanced Analytics</AlertTitle>
            <AlertAction>
              <Button
                aria-label='Close'
                size='xs'
                variant='ghost'
                className='text-ui-muted-foreground hover:text-ui-foreground -mt-1 -mr-2 size-7 p-0 hover:bg-transparent'
              >
                <RegistryIcon lucide='XIcon' className='size-3.5' />
              </Button>
            </AlertAction>
            <AlertDescription>
              We&apos;ve just released a new dashboard for tracking your
              team&apos;s performance.
              <Button
                variant='link'
                size='sm'
                className='text-info h-auto p-0 underline'
              >
                Explore features
              </Button>
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}
