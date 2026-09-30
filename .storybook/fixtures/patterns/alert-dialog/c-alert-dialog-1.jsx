import {
  DialogConfirmation,
  DialogConfirmationAction,
  DialogConfirmationCancel,
  DialogConfirmationContent,
  DialogConfirmationDescription,
  DialogConfirmationFooter,
  DialogConfirmationHeader,
  DialogConfirmationMedia,
  DialogConfirmationTitle,
  DialogConfirmationTrigger
} from '../../../../src/components/core/Dialog/parts/dialog-confirmation.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// One trigger per layout: default and small sizes, with or without an icon, destructive, and split actions.
const LAYOUTS = [
  {
    label: 'Centred',
    layout: 'centred',
    title: 'Are you absolutely sure?',
    description: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    action: 'Continue'
  },
  {
    label: 'Small',
    size: 'sm',
    title: 'Allow accessory to connect?',
    description: 'Do you want to allow the USB accessory to connect to this device?',
    cancel: "Don't allow",
    action: 'Allow'
  },
  {
    label: 'With icon',
    icon: 'BluetoothIcon',
    title: 'Pair with this device?',
    description: 'This will allow the device to connect and share data with your current session.',
    action: 'Connect'
  },
  {
    label: 'Small with icon',
    size: 'sm',
    icon: 'BluetoothIcon',
    title: 'Allow accessory to connect?',
    description: 'Do you want to allow the USB accessory to connect to this device?',
    cancel: "Don't allow",
    action: 'Allow'
  },
  {
    label: 'Destructive',
    icon: 'CircleAlertIcon',
    danger: true,
    title: 'Deactivate your account?',
    description: 'This will disable your account and remove your profile from all active searches.',
    cancel: 'Keep my account',
    action: 'Deactivate anyway'
  },
  {
    label: 'Small destructive',
    size: 'sm',
    icon: 'Trash2Icon',
    danger: true,
    title: 'Delete chat?',
    description: 'This will permanently delete this conversation and any memories saved during it.',
    action: 'Delete'
  },
  {
    label: 'Split actions',
    layout: 'split',
    size: 'sm',
    icon: 'LogOutIcon',
    title: 'Log out?',
    description: 'You can always sign back in to your account.',
    cancel: 'No',
    action: 'Yes, log out'
  }
];

function Media({ icon, danger }) {
  return (
    <DialogConfirmationMedia className={danger ? 'bg-danger-muted text-danger' : undefined}>
      <RegistryIcon lucide={icon} />
    </DialogConfirmationMedia>
  );
}

function Confirmation({ label, layout, size = 'default', icon, danger, title, description, cancel = 'Cancel', action }) {
  return (
    <DialogConfirmation>
      <DialogConfirmationTrigger asChild>
        <Button size='sm' variant='outline'>{label}</Button>
      </DialogConfirmationTrigger>
      <DialogConfirmationContent
        size={size}
        className={layout === 'centred' ? 'sm:max-w-sm' : layout === 'split' ? 'gap-0 overflow-hidden p-0' : undefined}
      >
        <DialogConfirmationHeader
          className={layout === 'centred' ? 'sm:place-items-center sm:text-center' : layout === 'split' ? 'p-6' : undefined}
        >
          {icon ? <Media icon={icon} danger={danger} /> : null}
          <DialogConfirmationTitle>{title}</DialogConfirmationTitle>
          <DialogConfirmationDescription>{description}</DialogConfirmationDescription>
        </DialogConfirmationHeader>
        {layout === 'split' ? (
          <DialogConfirmationFooter className='mx-0 mb-0 grid grid-cols-2 gap-0 divide-x divide-border border-t border-border p-0'>
            <DialogConfirmationCancel variant='ghost' className='h-10 rounded-none border-0'>{cancel}</DialogConfirmationCancel>
            <DialogConfirmationAction variant='ghost' className='h-10 rounded-none border-0'>{action}</DialogConfirmationAction>
          </DialogConfirmationFooter>
        ) : (
          <DialogConfirmationFooter className={layout === 'centred' ? 'sm:justify-center' : undefined}>
            <DialogConfirmationCancel variant={danger && size === 'sm' ? 'ghost' : 'outline'}>{cancel}</DialogConfirmationCancel>
            <DialogConfirmationAction variant={danger ? 'destructive' : 'default'}>{action}</DialogConfirmationAction>
          </DialogConfirmationFooter>
        )}
      </DialogConfirmationContent>
    </DialogConfirmation>
  );
}

export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {LAYOUTS.map((layout) => (
        <Confirmation key={layout.label} {...layout} />
      ))}
    </div>
  );
}
