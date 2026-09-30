import {
  DialogConfirmation,
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
        <Button variant='outline'>View Confirmation</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent className='gap-4 p-6 sm:max-w-sm'>
        <div className='mx-auto flex flex-col items-center justify-center gap-2'>
          <DialogConfirmationMedia className='bg-info-muted text-info size-12 rounded-full'>
            <RegistryIcon lucide='CheckIcon' className='size-5' />
          </DialogConfirmationMedia>
          <DialogConfirmationTitle className='text-center'>
            Success! Your e-ticket is registered.
          </DialogConfirmationTitle>
          <DialogConfirmationDescription className='max-w-xs text-center'>
            Please check your email for confirmation and further instructions
            about the event.
          </DialogConfirmationDescription>
        </div>

        <div className='grid gap-2 rounded-lg bg-surface-muted p-3'>
          {[
            ['Order Number', 'GBD99763JS'],
            ['Order Date', '7 September 2024'],
            ['Event Name', 'Groove Beats Day Fest'],
            ['Event Date', '20/09/2024'],
            ['Register Date', '20/09/2024 | 09 PM']
          ].map(([label, value]) => (
            <div
              key={label}
              className='flex items-center justify-between text-sm'
            >
              <span className='text-text-muted font-medium'>
                {label}
              </span>
              <span className='text-text font-semibold'>{value}</span>
            </div>
          ))}
        </div>

        <DialogConfirmationFooter className='-mx-6 -mb-6 px-6'>
          <DialogConfirmationCancel variant='default' className='w-full sm:w-full'>
            Back to home
          </DialogConfirmationCancel>
        </DialogConfirmationFooter>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
