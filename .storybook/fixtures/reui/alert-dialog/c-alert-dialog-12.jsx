// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
        <Button variant='outline'>Subscription Expiring</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent className='gap-0 p-0 sm:max-w-sm'>
        <div className='mx-auto flex flex-col items-center justify-center gap-2 p-8'>
          <DialogConfirmationMedia className='bg-ui-destructive/10 text-ui-destructive dark:bg-ui-destructive/20 size-12 rounded-full'>
            <RegistryIcon lucide='BellIcon' className='size-6' />
          </DialogConfirmationMedia>
          <DialogConfirmationTitle className='text-center'>
            Subscription Expiring Soon
          </DialogConfirmationTitle>
          <Badge variant='destructive-light' className='font-normal'>
            Expires in 2 days
          </Badge>
        </div>

        <div className='bg-ui-muted/60 flex flex-col items-center justify-center gap-5 rounded-b-2xl p-6'>
          <DialogConfirmationDescription className='text-ui-muted-foreground text-center'>
            Your current plan will expire in 2 days. Update your payment method
            now to ensure uninterrupted access to your Pro features.
          </DialogConfirmationDescription>
          {/* The footer sits inside this `p-6` section, not directly in the
       content, so its breakout has to cancel THAT padding (`-mx-6
       -mb-6`) to reach the edges. `self-stretch` is required because the
       section is `items-center`, which would otherwise shrink the bar to
       its content width and leave the top border floating short. */}
          <DialogConfirmationFooter className='-mx-6 -mb-6 gap-4 self-stretch rounded-b-2xl p-6'>
            <DialogConfirmationCancel>Remind Me Later</DialogConfirmationCancel>
            <DialogConfirmationAction>Update Payment</DialogConfirmationAction>
          </DialogConfirmationFooter>
        </div>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
