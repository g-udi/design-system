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

// The same notice layout in two tones: a status badge under the title, the details on a muted panel.
const NOTICES = [
  {
    trigger: 'System update',
    icon: 'ShieldAlertIcon',
    media: 'bg-info-muted text-info',
    title: 'System update available',
    badge: { variant: 'success-light', label: 'Release v28.1.0 (2026-01-12)' },
    description: 'A new version is ready. Restarting now applies the latest security patches and features.',
    action: 'Update now'
  },
  {
    trigger: 'Subscription expiring',
    icon: 'BellIcon',
    media: 'bg-danger-muted text-danger',
    title: 'Subscription expiring soon',
    badge: { variant: 'destructive-light', label: 'Expires in 2 days' },
    description: 'Update your payment method now to keep uninterrupted access to your Pro features.',
    action: 'Update payment'
  }
];

export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {NOTICES.map((notice) => (
        <DialogConfirmation key={notice.trigger}>
          <DialogConfirmationTrigger asChild>
            <Button size='sm' variant='outline'>{notice.trigger}</Button>
          </DialogConfirmationTrigger>
          <DialogConfirmationContent className='gap-0 overflow-hidden p-0 sm:max-w-sm'>
            <div className='flex flex-col items-center gap-2 p-6 text-center'>
              <DialogConfirmationMedia className={`size-10 rounded-full ${notice.media}`}>
                <RegistryIcon lucide={notice.icon} className='size-5' />
              </DialogConfirmationMedia>
              <DialogConfirmationTitle>{notice.title}</DialogConfirmationTitle>
              <Badge variant={notice.badge.variant}>{notice.badge.label}</Badge>
            </div>
            <div className='grid gap-3 border-t border-border bg-surface-muted p-4'>
              <DialogConfirmationDescription className='text-center'>
                {notice.description}
              </DialogConfirmationDescription>
              <DialogConfirmationFooter className='mx-0 mb-0 border-0 bg-transparent p-0'>
                <DialogConfirmationCancel>Remind me later</DialogConfirmationCancel>
                <DialogConfirmationAction>{notice.action}</DialogConfirmationAction>
              </DialogConfirmationFooter>
            </div>
          </DialogConfirmationContent>
        </DialogConfirmation>
      ))}
    </div>
  );
}
