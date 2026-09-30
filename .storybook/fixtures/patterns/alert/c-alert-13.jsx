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
        <FramePanel className='p-0!'>
          <Alert
            variant='success'
            className='rounded-none border-0 shadow-none'
          >
            <RegistryIcon lucide='CircleCheckIcon' />
            <AlertTitle>Deployment Successful</AlertTitle>
            <AlertDescription>
              Your application has been successfully deployed to the production
              environment.
            </AlertDescription>
          </Alert>
        </FramePanel>
        <FramePanel className='p-0!'>
          <Alert
            variant='warning'
            className='rounded-none border-0 shadow-none'
          >
            <RegistryIcon
              lucide='AlertTriangleIcon'
              className='text-yellow-500'
            />
            <AlertTitle>Resource Limit Reached</AlertTitle>
            <AlertAction>
              <Button size='xs'>Verify</Button>
            </AlertAction>
            <AlertDescription>
              Your current plan has reached its resource limits. Consider
              upgrading to a higher tier.
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}
