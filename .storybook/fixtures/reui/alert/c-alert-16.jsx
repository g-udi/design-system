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
          <Alert
            variant='destructive'
            className='bg-ui-destructive/5 border-0 shadow-none'
          >
            <RegistryIcon lucide='CreditCardIcon' />
            <AlertTitle>Subscription Expiring</AlertTitle>
            <AlertAction>
              <Button size='xs' variant='destructive'>
                Renew Now
              </Button>
            </AlertAction>
            <AlertDescription>
              Your annual subscription will expire in 3 days. Renew now to avoid
              service interruption and data loss.
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}
