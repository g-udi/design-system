import {
  DialogConfirmationRoot as DialogConfirmation,
  DialogConfirmationAction,
  DialogConfirmationCancel,
  DialogConfirmationContent,
  DialogConfirmationDescription,
  DialogConfirmationFooter,
  DialogConfirmationHeader,
  DialogConfirmationMedia,
  DialogConfirmationTitle,
  DialogConfirmationTrigger
} from '@gaudi/design-system/core/Dialog';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// One trigger per layout: default and small sizes, with or without an icon, destructive, and split actions.
const LAYOUTS = [
  {
    label: 'Centred',
    layout: 'centred',
    title: 'Delete this publication?',
    description: 'Every post, draft and subscriber list in this publication is removed. This cannot be reversed.',
    action: 'Continue'
  },
  {
    label: 'Small',
    size: 'sm',
    title: 'Connect the drawing tablet?',
    description: 'The tablet will be able to send pen input to this editor.',
    cancel: "Don't allow",
    action: 'Allow'
  },
  {
    label: 'With icon',
    icon: 'BluetoothIcon',
    title: 'Use this phone for sign-in?',
    description: 'Sign-in prompts will be sent to this phone until you remove it.',
    action: 'Connect'
  },
  {
    label: 'Small with icon',
    size: 'sm',
    icon: 'BluetoothIcon',
    title: 'Connect the drawing tablet?',
    description: 'The tablet will be able to send pen input to this editor.',
    cancel: "Don't allow",
    action: 'Allow'
  },
  {
    label: 'Destructive',
    icon: 'CircleAlertIcon',
    danger: true,
    title: 'Pause your author profile?',
    description: 'Your posts stay online, but your profile is hidden from search and the contributors page.',
    cancel: 'Keep it visible',
    action: 'Pause profile'
  },
  {
    label: 'Small destructive',
    size: 'sm',
    icon: 'Trash2Icon',
    danger: true,
    title: 'Delete chat?',
    description: 'The conversation and any notes saved from it are removed for good.',
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
