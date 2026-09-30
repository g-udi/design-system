import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Cookie Preferences</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              You can enable or disable different categories of cookies.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='flex items-center justify-between gap-4'>
              <div className='space-y-0.75'>
                <Label className='text-sm font-medium'>Essential Cookies</Label>
                <p className='text-text-muted text-xs'>
                  Required for the website to function properly. Cannot be
                  disabled.
                </p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            <div className='flex items-center justify-between gap-4'>
              <div className='space-y-0.75'>
                <Label
                  htmlFor='cookie-analytics'
                  className='text-sm font-medium'
                >
                  Analytics Cookies
                </Label>
                <p className='text-text-muted text-xs'>
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <Switch id='cookie-analytics' />
            </div>
            <div className='flex items-center justify-between gap-4'>
              <div className='space-y-0.75'>
                <Label
                  htmlFor='cookie-marketing'
                  className='text-sm font-medium'
                >
                  Marketing Cookies
                </Label>
                <p className='text-text-muted text-xs'>
                  Used to deliver personalized advertisements and track ad
                  campaign performance.
                </p>
              </div>
              <Switch id='cookie-marketing' />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline'>Save Preferences</Button>
            <Button>Accept All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
