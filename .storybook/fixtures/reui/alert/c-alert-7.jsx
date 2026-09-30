// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Alert variant='warning'>
      <RegistryIcon lucide='AlertTriangleIcon' />
      <AlertTitle>Warning! Something is wrong</AlertTitle>
      <AlertDescription>
        Please check your settings. If the problem persists, contact support.
      </AlertDescription>
    </Alert>
  );
}
