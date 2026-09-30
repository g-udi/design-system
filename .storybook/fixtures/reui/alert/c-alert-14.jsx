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
          <Alert className='border-0 shadow-none'>
            <RegistryIcon
              lucide='ShieldCheckIcon'
              className='text-emerald-500'
            />
            <AlertTitle>Security Update</AlertTitle>
            <AlertAction>
              <Button variant='outline' size='xs'>
                Dismiss
              </Button>
              <Button size='xs'>Update</Button>
            </AlertAction>
            <AlertDescription>
              Update your password and enable 2FA to improve your account
              security.
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}
