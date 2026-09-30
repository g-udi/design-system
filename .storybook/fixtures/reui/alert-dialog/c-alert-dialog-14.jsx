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
const SECURITY_ITEMS = [
  {
    icon: (
      <RegistryIcon
        lucide='LockIcon'
        className='text-ui-muted-foreground size-4'
      />
    ),
    title: 'Password Policy',
    description: 'Verify strength and rotation',
    status: 'Pending'
  },
  {
    icon: (
      <RegistryIcon
        lucide='FingerprintPatternIcon'
        className='text-ui-muted-foreground size-4'
      />
    ),
    title: 'Biometric Status',
    description: 'Check hardware encryption',
    status: 'Done'
  },
  {
    icon: (
      <RegistryIcon
        lucide='KeySquareIcon'
        className='text-ui-muted-foreground size-4'
      />
    ),
    title: 'Active Sessions',
    description: 'Review connected devices',
    status: 'Pending'
  }
];
export function Pattern() {
  return (
    <DialogConfirmation>
      <DialogConfirmationTrigger asChild>
        <Button variant='outline'>Advanced Security Check</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent className='max-w-sm! gap-0 overflow-hidden p-0'>
        {/* Header */}
        <div className='flex flex-col items-center justify-center gap-1.5 px-4 pt-6 pb-5 text-center'>
          <DialogConfirmationMedia className='size-12 rounded-full bg-green-50 text-green-500 dark:bg-green-950 dark:text-green-400'>
            <RegistryIcon lucide='ShieldAlertIcon' className='size-6' />
          </DialogConfirmationMedia>
          <DialogConfirmationTitle className='text-base font-semibold'>
            Advanced Security Audit
          </DialogConfirmationTitle>
          <DialogConfirmationDescription className='p-0 text-sm'>
            Summary of your account status and security settings.
          </DialogConfirmationDescription>
        </div>

        {/* Content */}
        <div className='space-y-3 p-4'>
          {SECURITY_ITEMS.map((item) => (
            <div
              key={item.title}
              className='border-ui-border flex items-center justify-between rounded-md border border-dashed px-3 py-2.5'
            >
              <div className='flex items-center gap-2.5'>
                <div className='bg-ui-background border-ui-border/80 flex size-8 items-center justify-center rounded-md border shadow-xs'>
                  {item.icon}
                </div>
                <div className='flex flex-col gap-0.25'>
                  <span className='text-sm font-medium'>{item.title}</span>
                  <span className='text-ui-muted-foreground text-xs'>
                    {item.description}
                  </span>
                </div>
              </div>
              <Badge
                variant={
                  item.status === 'Pending' ? 'warning-light' : 'success-light'
                }
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </div>

        {/* Footer */}
        {/* The content is `p-0`, so there is no padding to escape: the footer's
       built-in `-mx-3 -mb-3` pushed the bar OUTSIDE the dialog, where
       `overflow-hidden` clipped it - which is why it looked like it had no
       padding. Cancelling the breakout puts it flush edge-to-edge with its
       own `p-4` intact. */}
        <DialogConfirmationFooter className='mx-0 mb-0 grid grid-cols-1 gap-2 p-4'>
          <DialogConfirmationAction variant='default' className='flex-1'>
            Start Deep Audit
          </DialogConfirmationAction>
          <DialogConfirmationCancel variant='ghost' className='flex-1'>
            Skip for now
          </DialogConfirmationCancel>
        </DialogConfirmationFooter>
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}
