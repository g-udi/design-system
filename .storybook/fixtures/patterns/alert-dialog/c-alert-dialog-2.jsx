import {
  DialogConfirmation,
  DialogConfirmationAction,
  DialogConfirmationCancel,
  DialogConfirmationContent,
  DialogConfirmationDescription,
  DialogConfirmationFooter,
  DialogConfirmationHeader,
  DialogConfirmationTitle,
  DialogConfirmationTrigger
} from '../../../../src/components/core/Dialog/parts/dialog-confirmation.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
export function Pattern() {
  return (
    <DialogConfirmation>
      <DialogConfirmationTrigger asChild>
        <Button variant='outline'>Small Alert</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent size='sm'>
        <DialogConfirmationHeader>
          <DialogConfirmationTitle>Allow accessory to connect?</DialogConfirmationTitle>
          <DialogConfirmationDescription>
            Do you want to allow the USB accessory to connect to this device?
          </DialogConfirmationDescription>
        </DialogConfirmationHeader>
        <DialogConfirmationFooter>
          <DialogConfirmationCancel>Don't allow</DialogConfirmationCancel>
          <DialogConfirmationAction>Allow</DialogConfirmationAction>
        </DialogConfirmationFooter>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
