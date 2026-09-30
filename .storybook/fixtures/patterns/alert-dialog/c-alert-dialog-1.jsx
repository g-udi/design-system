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
        <Button variant='outline'>Open Confirmation Dialog</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent className='sm:max-w-sm'>
        <DialogConfirmationHeader className='sm:place-items-center sm:text-center'>
          <DialogConfirmationTitle>Are you absolutely sure?</DialogConfirmationTitle>
          <DialogConfirmationDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogConfirmationDescription>
        </DialogConfirmationHeader>
        <DialogConfirmationFooter className='sm:justify-center'>
          <DialogConfirmationCancel>Cancel</DialogConfirmationCancel>
          <DialogConfirmationAction>Continue</DialogConfirmationAction>
        </DialogConfirmationFooter>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
