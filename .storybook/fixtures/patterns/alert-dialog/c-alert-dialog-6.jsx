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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
export function Pattern() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alert Dialog Example</DialogTitle>
          <DialogDescription>
            Click the button below to open an alert dialog.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogConfirmation>
            <DialogConfirmationTrigger asChild>
              <Button>Open Confirmation Dialog</Button>
            </DialogConfirmationTrigger>
            <DialogConfirmationContent size='sm'>
              <DialogConfirmationHeader>
                <DialogConfirmationTitle>Are you absolutely sure?</DialogConfirmationTitle>
                <DialogConfirmationDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogConfirmationDescription>
              </DialogConfirmationHeader>
              <DialogConfirmationFooter>
                <DialogConfirmationCancel>Cancel</DialogConfirmationCancel>
                <DialogConfirmationAction>Continue</DialogConfirmationAction>
              </DialogConfirmationFooter>
            </DialogConfirmationContent>
          </DialogConfirmation>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
