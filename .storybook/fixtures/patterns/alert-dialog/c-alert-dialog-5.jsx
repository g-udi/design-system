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
        <Button variant='destructive'>Delete Chat</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent size='sm'>
        <DialogConfirmationHeader>
          <DialogConfirmationMedia className='bg-ui-destructive/10 text-ui-destructive dark:bg-ui-destructive/20 dark:text-ui-destructive'>
            <RegistryIcon lucide='Trash2Icon' />
          </DialogConfirmationMedia>
          <DialogConfirmationTitle>Delete chat?</DialogConfirmationTitle>
          <DialogConfirmationDescription>
            This will permanently delete this chat conversation. View{' '}
            <a href='#' className='underline'>
              Settings
            </a>{' '}
            to delete any memories saved during this chat.
          </DialogConfirmationDescription>
        </DialogConfirmationHeader>
        <DialogConfirmationFooter>
          <DialogConfirmationCancel variant='ghost'>Cancel</DialogConfirmationCancel>
          <DialogConfirmationAction variant='destructive'>Delete</DialogConfirmationAction>
        </DialogConfirmationFooter>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
