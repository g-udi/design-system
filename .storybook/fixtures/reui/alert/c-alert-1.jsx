// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
export function Pattern() {
  return (
    <Alert>
      <AlertTitle>Alert!</AlertTitle>
      <AlertDescription>
        This is an alert with a title and description.
      </AlertDescription>
    </Alert>
  );
}
