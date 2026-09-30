import {
  Alert,
  AlertAction,
  AlertDescription
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Alert>
      <RegistryIcon lucide='ShieldCheckIcon' />
      <AlertDescription>Update your password and enable 2FA.</AlertDescription>
      <AlertAction>
        <Button variant='outline' size='xs'>
          Dismiss
        </Button>
        <Button size='xs'>Update</Button>
      </AlertAction>
    </Alert>
  );
}
