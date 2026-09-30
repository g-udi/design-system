import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Alert variant='info'>
      <RegistryIcon lucide='CircleAlertIcon' />
      <AlertTitle>Info! Something important</AlertTitle>
      <AlertDescription>
        This is an important message. Please read it carefully.
      </AlertDescription>
    </Alert>
  );
}
