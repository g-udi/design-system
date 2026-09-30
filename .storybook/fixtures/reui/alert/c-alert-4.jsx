// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Alert variant='destructive'>
      <RegistryIcon lucide='CircleAlertIcon' />
      <AlertTitle>Payment Failed</AlertTitle>
      <AlertDescription>
        <p>Please check your payment details:</p>
        <ul className='mt-1 list-inside list-disc space-y-0.5 text-sm'>
          <li>Card number and expiry</li>
          <li>Billing address</li>
          <li>Available funds</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
