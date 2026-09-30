// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  DialogConfirmation,
  DialogConfirmationAction,
  DialogConfirmationCancel,
  DialogConfirmationContent,
  DialogConfirmationDescription,
  DialogConfirmationFooter,
  DialogConfirmationHeader,
  DialogConfirmationMedia,
  DialogConfirmationTitle,
  DialogConfirmationTrigger
} from '../../../../src/components/core/Dialog/parts/dialog-confirmation.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <DialogConfirmation>
      <DialogConfirmationTrigger asChild>
        <Button variant='outline'>Default (Media)</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent>
        <DialogConfirmationHeader>
          <DialogConfirmationMedia>
            <RegistryIcon lucide='BluetoothIcon' />
          </DialogConfirmationMedia>
          <DialogConfirmationTitle>Pair with this device?</DialogConfirmationTitle>
          <DialogConfirmationDescription>
            This will allow the device to connect and share data with your
            current session.
          </DialogConfirmationDescription>
        </DialogConfirmationHeader>
        <DialogConfirmationFooter>
          <DialogConfirmationCancel>Cancel</DialogConfirmationCancel>
          <DialogConfirmationAction>Connect</DialogConfirmationAction>
        </DialogConfirmationFooter>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
