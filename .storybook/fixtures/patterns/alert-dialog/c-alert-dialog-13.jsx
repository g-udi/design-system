import {
  DialogConfirmation,
  DialogConfirmationAction,
  DialogConfirmationCancel,
  DialogConfirmationContent,
  DialogConfirmationDescription,
  DialogConfirmationFooter,
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
        <Button variant='outline'>Logout</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent
        size='sm'
        className='gap-0 overflow-hidden p-0 sm:max-w-sm'
      >
        <div className='flex flex-col items-center justify-center gap-2 p-8'>
          <DialogConfirmationMedia className='rounded-full size-12 bg-violet-50 text-violet-500 dark:bg-violet-950 dark:text-violet-400'>
            <RegistryIcon lucide='ShieldQuestionMarkIcon' className='size-6' />
          </DialogConfirmationMedia>
          <DialogConfirmationTitle className='text-center text-base font-semibold'>
            Are you sure?
          </DialogConfirmationTitle>
          <DialogConfirmationDescription className='p-0 text-center text-sm font-medium'>
            You can always log in later to your account.
          </DialogConfirmationDescription>
        </div>
        <DialogConfirmationFooter className='mx-0 mb-0 grid flex-none grid-cols-2 gap-0 divide-x border-t p-0'>
          <DialogConfirmationCancel
            variant='ghost'
            className='border-ui-border h-12 flex-1 rounded-none border-0 border-r p-0'
          >
            No
          </DialogConfirmationCancel>
          <DialogConfirmationAction
            variant='ghost'
            className='h-12 flex-1 rounded-none border-0 p-0'
          >
            Yes, Logout
          </DialogConfirmationAction>
        </DialogConfirmationFooter>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
