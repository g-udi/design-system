'use client';
import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { default as ToastProvider, toast } from '../../../../src/components/core/Toast/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const toasterId = 'toast-custom';
const portrait = (path) => `https://randomuser.me/api/portraits/${path}.jpg`;
const reviewers = [
  ['Alex Johnson', 'men/32'],
  ['Sarah Chen', 'women/44'],
  ['David Kim', 'men/49']
];
const initials = (name) => name.split(' ').map((part) => part[0]).join('');
// Custom toasts render inside the toast surface, so they only lay out their content.
function Actions({ secondary, primary, onPrimary, tone = 'accent' }) {
  return (
    <div className='flex gap-2 pt-1'>
      {secondary && (
        <Button size='xs' variant='ghost' tone='neutral' className='text-current' onClick={() => toast.dismiss()}>
          {secondary}
        </Button>
      )}
      <Button size='xs' tone={tone} onClick={() => { toast.dismiss(); onPrimary?.(); }}>
        {primary}
      </Button>
    </div>
  );
}
function Body({ title, meta, children }) {
  return (
    <div className='flex min-w-0 flex-1 flex-col gap-1'>
      <div className='flex items-center justify-between gap-2'>
        <p className='text-sm font-semibold'>{title}</p>
        {meta && <span className='text-xs opacity-60'>{meta}</span>}
      </div>
      {children}
    </div>
  );
}
const StatusIcon = ({ icon, className }) => (
  <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${className}`}>
    <RegistryIcon lucide={icon} className='size-3.5' aria-hidden='true' />
  </span>
);
const done = (message) => () => toast.success(message, { toasterId });
const templates = [
  {
    label: 'Message',
    render: () => (
      <div className='flex w-full items-start gap-3'>
        <Avatar className='size-8 shrink-0'>
          <AvatarImage src={portrait('women/44')} alt='Sarah Chen' />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Body title='Sarah Chen' meta='2m ago'>
          <p className='text-sm opacity-75'>Invited you to collaborate on &quot;Design System v2&quot;.</p>
          <Actions secondary='Decline' primary='Accept' onPrimary={done('Invitation accepted')} />
        </Body>
      </div>
    )
  },
  {
    label: 'Update',
    accent: true,
    render: () => (
      <div className='flex w-full items-start gap-3'>
        <StatusIcon icon='InfoIcon' className='bg-accent/15 text-accent' />
        <Body title='New version available'>
          <p className='text-sm opacity-75'>v2.4.0 includes performance improvements and bug fixes.</p>
          <Actions secondary='Later' primary='Update now' />
        </Body>
      </div>
    )
  },
  {
    label: 'Session',
    duration: 10000,
    render: () => (
      <div className='flex w-full items-start gap-3'>
        <StatusIcon icon='TriangleAlertIcon' className='bg-warning text-surface' />
        <Body title='Session expiring'>
          <p className='text-sm opacity-75'>You will be signed out in 5 minutes due to inactivity.</p>
          <Actions primary='Extend session' tone='warning' onPrimary={done('Session extended')} />
        </Body>
      </div>
    )
  },
  {
    label: 'Deployment',
    render: () => (
      <div className='flex w-full flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <span className='bg-success size-2 rounded-full' />
          <p className='flex-1 text-sm font-semibold'>Deployment successful</p>
          <span className='text-xs opacity-60'>42s</span>
        </div>
        <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs'>
          {[['Environment', 'Production'], ['Commit', 'a1b2c3d'], ['Channels', '3 syncing']].map(([term, value]) => (
            <div key={term} className='contents'>
              <dt className='opacity-60'>{term}</dt>
              <dd className='text-right font-medium'>{value}</dd>
            </div>
          ))}
        </dl>
        <Actions secondary='View logs' primary='Open site' />
      </div>
    )
  },
  {
    label: 'Build failed',
    render: () => (
      <div className='flex w-full min-w-0 flex-col gap-2'>
        <div className='flex items-start gap-3'>
          <StatusIcon icon='XIcon' className='bg-danger text-surface' />
          <Body title='Build failed'>
            <p className='text-sm opacity-75'>Compilation errors in 2 files.</p>
          </Body>
        </div>
        <Separator className='opacity-20' />
        <div className='min-w-0 space-y-1 font-mono text-xs opacity-70'>
          <p className='truncate'>src/api/auth.ts:42 — TypeError: undefined is not a function</p>
          <p className='truncate'>src/utils/parse.ts:18 — SyntaxError: Unexpected token</p>
        </div>
        <Actions secondary='View logs' primary='Retry build' tone='danger' onPrimary={done('Build restarted')} />
      </div>
    )
  },
  {
    label: 'Pull request',
    render: () => (
      <div className='flex w-full flex-col gap-2'>
        <Body title='Pull request #284' meta='2m ago'>
          <p className='text-sm opacity-75'>
            All reviewers approved. Ready to merge into <code className='font-mono text-xs'>main</code>.
          </p>
        </Body>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex -space-x-2'>
            {reviewers.map(([name, path]) => (
              <Avatar key={name} className='size-6 ring-2 ring-current/10'>
                <AvatarImage src={portrait(path)} alt={name} />
                <AvatarFallback className='text-xs'>{initials(name)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Actions secondary='View' primary='Merge' tone='success' onPrimary={done('Merged into main')} />
        </div>
      </div>
    )
  }
];
export function Pattern() {
  const [inverted, setInverted] = useState(false);
  const show = ({ render, duration, accent }) =>
    toast.custom(render, {
      toasterId,
      duration,
      // Custom content renders in the title slot, so it takes the full row and drops the title weight.
      classNames: {
        content: 'min-w-0 flex-1',
        title: 'font-normal text-current',
        toast: [inverted && 'bg-text text-surface border-transparent', accent && 'border-accent/50']
          .filter(Boolean)
          .join(' ')
      }
    });
  return (
    <div className='mx-auto grid w-full max-w-md gap-3'>
      <div role='group' aria-label='Custom toasts' className='grid grid-cols-3 gap-2'>
        {templates.map((template) => (
          <Button key={template.label} size='sm' variant='outline' tone='neutral' onClick={() => show(template)}>
            {template.label}
          </Button>
        ))}
      </div>
      <Label className='justify-center gap-2 text-sm font-normal'>
        <Switch size='sm' checked={inverted} onCheckedChange={setInverted} />
        Inverted surface
      </Label>
      <ToastProvider id={toasterId} />
    </div>
  );
}
