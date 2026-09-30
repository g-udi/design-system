// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Alert>
      <RegistryIcon lucide='CircleCheckIcon' />
      <AlertTitle>Alert!</AlertTitle>
      <AlertDescription>
        This is an alert with icon, title and description.
      </AlertDescription>
    </Alert>
  );
}
