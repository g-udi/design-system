import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
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
        <Button variant='outline'>System Update</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent className='gap-0 p-0 sm:max-w-sm'>
        <div className='mx-auto flex flex-col items-center justify-center gap-2 p-8'>
          <DialogConfirmationMedia className='bg-info/10 text-info dark:bg-info/20 size-12 rounded-full'>
            <RegistryIcon lucide='ShieldAlertIcon' className='size-6' />
          </DialogConfirmationMedia>
          <DialogConfirmationTitle className='text-center'>
            System Update Available!
          </DialogConfirmationTitle>
          <Badge variant='success-light'>Release v28.1.0 (2026-01-12)</Badge>
        </div>

        <div className='bg-ui-muted/60 flex flex-col items-center justify-center gap-5 rounded-b-2xl p-6'>
          <DialogConfirmationDescription className='text-ui-muted-foreground text-center'>
            A new version of the application is ready. Restarting now will apply
            the latest security patches and features.
          </DialogConfirmationDescription>
          {/* The footer sits inside this `p-6` section, not directly in the
       content, so its breakout has to cancel THAT padding (`-mx-6
       -mb-6`) to reach the edges. `self-stretch` is required because the
       section is `items-center`, which would otherwise shrink the bar to
       its content width and leave the top border floating short. */}
          <DialogConfirmationFooter className='-mx-6 -mb-6 gap-4 self-stretch rounded-b-2xl p-6'>
            <DialogConfirmationCancel>Remind Me Later</DialogConfirmationCancel>
            <DialogConfirmationAction>Update Now</DialogConfirmationAction>
          </DialogConfirmationFooter>
        </div>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
