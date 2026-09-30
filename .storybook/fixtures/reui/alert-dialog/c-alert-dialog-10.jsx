// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
      <DialogConfirmationContent className='gap-8 p-8 sm:max-w-sm'>
        <div className='mx-auto flex flex-col items-center justify-center gap-2'>
          <DialogConfirmationMedia className='bg-info/10 text-info dark:bg-info/20 size-16 rounded-full'>
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

        <div className='bg-ui-muted/60 grid gap-4 rounded-xl p-4'>
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
              <span className='text-ui-muted-foreground font-medium'>
                {label}
              </span>
              <span className='text-ui-foreground font-semibold'>{value}</span>
            </div>
          ))}
        </div>

        {/* The footer's built-in `-mx-4 -mb-4` cancels the content's DEFAULT
       `p-4`. This dialog uses `p-8`, so the breakout has to match it -
       otherwise the bar (and its top border) stops 1rem short on each
       side. `px-8` keeps the button aligned with the body above. */}
        <DialogConfirmationFooter className='-mx-8 -mb-8 px-8'>
          <DialogConfirmationCancel
            size='lg'
            variant='default'
            className='w-full sm:w-full'
          >
            Back to Home
          </DialogConfirmationCancel>
        </DialogConfirmationFooter>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
