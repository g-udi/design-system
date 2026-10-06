'use client';
import { useId, useState } from 'react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Label } from '@gaudi/design-system/core/Field';
import { Separator } from '@gaudi/design-system/core/Separator';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { default as ToastProvider, toast } from '@gaudi/design-system/core/Toast';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const portrait = (path) => `/avatars/${path}.svg`;
const reviewers = [
  ['Anouk Varga', 'person-41'],
  ['Sabine Okafor', 'person-20'],
  ['Ottilie Nakamura', 'person-45']
];
const initials = (name) => name.split(' ').map((part) => part[0]).join('');
// Custom toasts render inside the toast surface, so they only lay out their content.
function Actions({ toastId, secondary, primary, onPrimary, onSecondary, tone = 'accent' }) {
  return (
    <div className='flex gap-2 pt-1'>
      {secondary && (
        <Button size='xs' variant='ghost' tone='neutral' className='text-current' onClick={() => { toast.dismiss(toastId); onSecondary?.(); }}>
          {secondary}
        </Button>
      )}
      <Button size='xs' tone={tone} onClick={() => { toast.dismiss(toastId); onPrimary?.(); }}>
        {primary}
      </Button>
    </div>
  );
}
function Body({ title, meta, children }) {
  return (
    <div className='flex min-w-0 flex-1 flex-col gap-1'>
      <div className='flex items-center justify-between gap-2'>
        <p className='ds-label text-current'>{title}</p>
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
const done = (message, toasterId) => () => toast.success(message, { toasterId });
const templates = [
  {
    label: 'Message',
    render: ({ toastId, toasterId }) => (
      <div className='flex w-full items-start gap-3'>
        <Avatar className='size-8 shrink-0'>
          <AvatarImage src={portrait('person-20')} alt='Sabine Okafor' />
          <AvatarFallback>SO</AvatarFallback>
        </Avatar>
        <Body title='Sabine Okafor' meta='2m ago'>
          <p className='text-sm opacity-75'>Invited you to collaborate on &quot;Design System v2&quot;.</p>
          <Actions toastId={toastId} secondary='Decline' primary='Accept' onPrimary={done('Invitation accepted', toasterId)} />
        </Body>
      </div>
    )
  },
  {
    label: 'Update',
    accent: true,
    render: ({ toastId, toasterId }) => (
      <div className='flex w-full items-start gap-3'>
        <StatusIcon icon='InfoIcon' className='bg-info text-info-foreground' />
        <Body title='A new editor version is ready'>
          <p className='text-sm opacity-75'>2.4 adds footnote previews and faster image uploads.</p>
          <Actions toastId={toastId} secondary='Later' primary='Update now' onPrimary={done('Update installed', toasterId)} />
        </Body>
      </div>
    )
  },
  {
    label: 'Session',
    duration: 10000,
    render: ({ toastId, toasterId }) => (
      <div className='flex w-full items-start gap-3'>
        <StatusIcon icon='TriangleAlertIcon' className='bg-warning text-warning-foreground' />
        <Body title='Session expiring'>
          <p className='text-sm opacity-75'>You will be signed out in 5 minutes due to inactivity.</p>
          <Actions toastId={toastId} primary='Extend session' tone='warning' onPrimary={done('Session extended', toasterId)} />
        </Body>
      </div>
    )
  },
  {
    label: 'Deployment',
    render: ({ toastId, toasterId }) => (
      <div className='flex w-full flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <span className='bg-success size-2 rounded-full' />
          <p className='ds-label flex-1 text-current'>Deployment successful</p>
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
        <Actions toastId={toastId} secondary='View logs' primary='View summary' onSecondary={done('Deployment log: all checks passed', toasterId)} onPrimary={done('Production: commit a1b2c3d deployed to three channels', toasterId)} />
      </div>
    )
  },
  {
    label: 'Build failed',
    render: ({ toastId, toasterId }) => (
      <div className='flex w-full min-w-0 flex-col gap-2'>
        <div className='flex items-start gap-3'>
          <StatusIcon icon='XIcon' className='bg-danger text-danger-foreground' />
          <Body title='Build failed'>
            <p className='text-sm opacity-75'>Compilation errors in 2 files.</p>
          </Body>
        </div>
        <Separator className='opacity-20' />
        <div className='min-w-0 space-y-1 font-mono text-xs opacity-70'>
          <p className='truncate'>content/posts/notes.mdx:42: unknown component Callout</p>
          <p className='truncate'>content/posts/index.mdx:18: unclosed code fence</p>
        </div>
        <Actions toastId={toastId} secondary='View logs' onSecondary={done('Build log: fix the two errors, then retry', toasterId)} primary='Retry build' tone='danger' onPrimary={done('Build restarted', toasterId)} />
      </div>
    )
  },
  {
    label: 'Pull request',
    render: ({ toastId, toasterId }) => (
      <div className='flex w-full flex-col gap-2'>
        <Body title='Pull request #284' meta='2m ago'>
          <p className='text-sm opacity-75'>
            All reviewers approved. Ready to merge into <code className='font-mono text-xs'>main</code>.
          </p>
        </Body>
        <div className='flex items-center justify-between gap-2'>
          <AvatarGroup>
            {reviewers.map(([name, path]) => (
              <Avatar key={name} className='size-6 ring-2 ring-current/10'>
                <AvatarImage src={portrait(path)} alt={name} />
                <AvatarFallback>{initials(name)}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <Actions toastId={toastId} secondary='View' onSecondary={done('Pull request #284: all reviewers approved', toasterId)} primary='Merge' tone='success' onPrimary={done('Merged into main', toasterId)} />
        </div>
      </div>
    )
  }
];
export function Pattern() {
  const toasterId = useId();
  const [inverted, setInverted] = useState(false);
  const show = ({ render, duration, accent }) =>
    toast.custom((toastId) => render({ toastId, toasterId }), {
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
