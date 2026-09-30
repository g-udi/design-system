// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Alert variant='success'>
      <RegistryIcon lucide='CircleCheckIcon' />
      <AlertTitle>Success! All good</AlertTitle>
      <AlertDescription>
        Everything is working as expected. You can continue with your task.
      </AlertDescription>
    </Alert>
  );
}
