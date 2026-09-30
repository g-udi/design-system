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
        <Button variant='outline'>Small (Media)</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent size='sm'>
        <DialogConfirmationHeader>
          <DialogConfirmationMedia>
            <RegistryIcon lucide='BluetoothIcon' />
          </DialogConfirmationMedia>
          <DialogConfirmationTitle>Allow accessory to connect?</DialogConfirmationTitle>
          <DialogConfirmationDescription>
            Do you want to allow the USB accessory to connect to this device?
          </DialogConfirmationDescription>
        </DialogConfirmationHeader>
        <DialogConfirmationFooter>
          <DialogConfirmationCancel>Don&apos;t allow</DialogConfirmationCancel>
          <DialogConfirmationAction>Allow</DialogConfirmationAction>
        </DialogConfirmationFooter>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
