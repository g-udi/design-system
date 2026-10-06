import { useState } from 'react';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle
} from '@gaudi/design-system/core/Banner';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

export function Pattern() {
  const [securityVisible, setSecurityVisible] = useState(true);
  const [updateVisible, setUpdateVisible] = useState(true);
  const [updated, setUpdated] = useState(false);
  return (
    <div className='mx-auto grid w-full max-w-lg gap-3'>
      {securityVisible ? <Alert>
        <RegistryIcon lucide='ShieldCheckIcon' />
        <AlertTitle>Security update</AlertTitle>
        <AlertDescription>Review your sign-in methods and add a passkey.</AlertDescription>
        <AlertAction>
          <Button variant='outline' size='xs' onClick={() => setSecurityVisible(false)}>Dismiss</Button>
          <Button href='/settings/security' size='xs'>Update</Button>
        </AlertAction>
      </Alert> : null}
      <Alert>
        <RegistryIcon lucide='KeyRoundIcon' />
        <AlertTitle>Your API key expires in 7 days.</AlertTitle>
        <AlertAction>
          <Button href='/settings/api-keys' size='xs'>Rotate</Button>
        </AlertAction>
      </Alert>
      {updateVisible ? <Alert variant='info'>
        <RegistryIcon lucide='InfoIcon' />
        <AlertDescription>{updated ? 'Demo updated. No page reload was performed.' : 'A new version is available.'}</AlertDescription>
        <AlertAction>
          <Button variant='outline' size='xs' onClick={() => setUpdateVisible(false)}>Later</Button>
          <Button size='xs' disabled={updated} onClick={() => setUpdated(true)}>Reload</Button>
        </AlertAction>
      </Alert> : null}
      <Alert variant='destructive'>
        <RegistryIcon lucide='CircleAlertIcon' />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          <p>We could not renew your plan. Check these details:</p>
          <ul className='list-inside list-disc space-y-0.5 text-sm'>
            <li>Card number and expiry</li>
            <li>Billing address</li>
            <li>Available funds</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
