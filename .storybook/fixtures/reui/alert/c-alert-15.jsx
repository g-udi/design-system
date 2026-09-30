// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
      <Frame>
        <FramePanel className='overflow-hidden p-0!'>
          <Alert variant='invert' className='border-0 shadow-none'>
            <RegistryIcon lucide='ZapIcon' className='text-yellow-500' />
            <AlertTitle>Pro Feature</AlertTitle>
            <AlertAction>
              <Button
                variant='outline'
                size='xs'
                className='bg-ui-background/10 border-ui-border/10'
              >
                Dismiss
              </Button>
              <Button
                size='xs'
                className='border-blue-800 bg-blue-600 text-white hover:border-blue-900 hover:bg-blue-600'
              >
                Upgrade
              </Button>
            </AlertAction>
            <AlertDescription>
              This feature is only available for Pro users. Upgrade your plan to
              get access.
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}
