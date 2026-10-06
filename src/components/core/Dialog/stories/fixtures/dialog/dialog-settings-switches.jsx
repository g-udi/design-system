import { useId, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DialogRoot as Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@gaudi/design-system/core/Dialog';
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
export function Pattern() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState({ analytics: false, marketing: false });
  const [draft, setDraft] = useState(preferences);
  const [saved, setSaved] = useState(false);
  const save = (next) => { setPreferences(next); setSaved(true); setOpen(false); };
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <Dialog open={open} onOpenChange={(next) => { if (next) setDraft(preferences); setOpen(next); }}>
        <DialogTrigger asChild>
          <Button variant='outline'>Cookie Preferences</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Choose cookie categories for this local demo. No cookies are written.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex flex-col gap-0.75'>
                <Label htmlFor={`${id}-essential`} className='text-sm font-medium'>Essential Cookies</Label>
                <p className='text-text-muted text-xs'>
                  Required for the website to function properly. Cannot be
                  disabled.
                </p>
              </div>
              <Switch id={`${id}-essential`} checked disabled />
            </div>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex flex-col gap-0.75'>
                <Label
                  htmlFor={`${id}-analytics`}
                  className='text-sm font-medium'
                >
                  Analytics Cookies
                </Label>
                <p className='text-text-muted text-xs'>
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <Switch id={`${id}-analytics`} checked={draft.analytics} onCheckedChange={(checked) => setDraft((current) => ({ ...current, analytics: checked }))} />
            </div>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex flex-col gap-0.75'>
                <Label
                  htmlFor={`${id}-marketing`}
                  className='text-sm font-medium'
                >
                  Marketing Cookies
                </Label>
                <p className='text-text-muted text-xs'>
                  Used to deliver personalized advertisements and track ad
                  campaign performance.
                </p>
              </div>
              <Switch id={`${id}-marketing`} checked={draft.marketing} onCheckedChange={(checked) => setDraft((current) => ({ ...current, marketing: checked }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => save(draft)}>Save Preferences</Button>
            <Button onClick={() => save({ analytics: true, marketing: true })}>Accept All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {saved && <p role='status' className='text-sm text-text-muted'>Demo preferences saved: analytics {preferences.analytics ? 'on' : 'off'}, marketing {preferences.marketing ? 'on' : 'off'}.</p>}
    </div>
  );
}
