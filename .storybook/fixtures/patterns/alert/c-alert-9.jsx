import {
  Alert,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Alert variant='invert'>
      <RegistryIcon lucide='CircleAlertIcon' className='text-success' />
      <AlertTitle>Notification! All good</AlertTitle>
      <AlertDescription>
        This is a notification alert with a title and description.
      </AlertDescription>
    </Alert>
  );
}
