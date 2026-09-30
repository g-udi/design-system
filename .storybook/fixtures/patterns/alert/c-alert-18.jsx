import { useState } from 'react';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle
} from '../../../../src/components/core/Banner/parts/alert-extended.jsx';
import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const all = ['discovery', 'promo', 'billing'];

export function Pattern() {
  const [open, setOpen] = useState(all);
  const dismiss = (id) => setOpen((ids) => ids.filter((item) => item !== id));
  const shown = (id) => open.includes(id);

  return (
    <div className='mx-auto grid w-full max-w-lg gap-3'>
      {shown('discovery') ? (
        <Frame variant='ghost'>
          <FramePanel className='overflow-hidden p-0!'>
            <Alert variant='info' className='border-0 shadow-none'>
              <RegistryIcon lucide='LightbulbIcon' />
              <AlertTitle>New: advanced analytics</AlertTitle>
              <AlertAction>
                <Button aria-label='Dismiss analytics notice' size='icon-xs' variant='ghost' onClick={() => dismiss('discovery')}>
                  <RegistryIcon lucide='XIcon' className='size-3.5' />
                </Button>
              </AlertAction>
              <AlertDescription>
                A new dashboard tracks your team&apos;s performance.
                <Button variant='link' size='sm' className='text-info h-auto p-0 underline'>
                  Explore features
                </Button>
              </AlertDescription>
            </Alert>
          </FramePanel>
        </Frame>
      ) : null}
      {shown('promo') ? (
        <Frame>
          <FramePanel className='overflow-hidden p-0!'>
            <Alert variant='invert' className='border-0 shadow-none'>
              <RegistryIcon lucide='ZapIcon' className='text-warning' />
              <AlertTitle>Pro feature</AlertTitle>
              <AlertAction>
                <Button variant='outline' size='xs' className='bg-ui-background/10 border-ui-border/10' onClick={() => dismiss('promo')}>
                  Dismiss
                </Button>
                <Button size='xs'>Upgrade</Button>
              </AlertAction>
              <AlertDescription>Upgrade your plan to unlock scheduled exports.</AlertDescription>
            </Alert>
          </FramePanel>
        </Frame>
      ) : null}
      {shown('billing') ? (
        <Frame>
          <FramePanel className='overflow-hidden p-0!'>
            <Alert variant='destructive' className='border-0 shadow-none'>
              <RegistryIcon lucide='CreditCardIcon' />
              <AlertTitle>Subscription expiring</AlertTitle>
              <AlertAction>
                <Button size='xs' variant='destructive' onClick={() => dismiss('billing')}>
                  Renew now
                </Button>
              </AlertAction>
              <AlertDescription>Your annual plan expires in 3 days. Renew to avoid interruption.</AlertDescription>
            </Alert>
          </FramePanel>
        </Frame>
      ) : null}
      {open.length < all.length ? (
        <Button variant='outline' size='sm' className='justify-self-start' onClick={() => setOpen(all)}>
          Restore notices
        </Button>
      ) : null}
    </div>
  );
}
