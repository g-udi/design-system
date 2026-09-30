import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-lg gap-3'>
      <Alert>
        <RegistryIcon lucide='ShieldCheckIcon' />
        <AlertTitle>Security update</AlertTitle>
        <AlertDescription>Update your password and enable 2FA.</AlertDescription>
        <AlertAction>
          <Button variant='outline' size='xs'>Dismiss</Button>
          <Button size='xs'>Update</Button>
        </AlertAction>
      </Alert>
      <Alert>
        <RegistryIcon lucide='KeyRoundIcon' />
        <AlertTitle>Your API key expires in 7 days.</AlertTitle>
        <AlertAction>
          <Button size='xs'>Rotate</Button>
        </AlertAction>
      </Alert>
      <Alert variant='info'>
        <RegistryIcon lucide='InfoIcon' />
        <AlertDescription>A new version is available.</AlertDescription>
        <AlertAction>
          <Button variant='outline' size='xs'>Later</Button>
          <Button size='xs'>Reload</Button>
        </AlertAction>
      </Alert>
      <Alert variant='destructive'>
        <RegistryIcon lucide='CircleAlertIcon' />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          <p>Please check your payment details:</p>
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
