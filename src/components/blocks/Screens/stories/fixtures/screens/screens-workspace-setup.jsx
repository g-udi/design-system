'use client';
import { useState } from 'react';
import { AvatarRoot as Avatar, AvatarFallback } from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Field, FieldDescription, FieldError, FieldLabel } from '@gaudi/design-system/core/Field';
import { default as Input } from '@gaudi/design-system/core/Input';
import { default as RadioGroup } from '@gaudi/design-system/core/RadioGroup';
import { default as Textarea } from '@gaudi/design-system/core/Textarea';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { default as Wizard } from '@gaudi/design-system/blocks/Wizard';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { Discord } from '@gaudi/design-system/icons/brands/discord';
import { Dropbox } from '@gaudi/design-system/icons/brands/dropbox';
import { GoogleDrive } from '@gaudi/design-system/icons/brands/googleDrive';
import { Loom } from '@gaudi/design-system/icons/brands/loom';
import { Slack } from '@gaudi/design-system/icons/brands/slack';
import { Zoom } from '@gaudi/design-system/icons/brands/zoom';

const steps = [
  { id: 'profile', label: 'You' },
  { id: 'role', label: 'Role' },
  { id: 'source', label: 'Discovery' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'import', label: 'Import' },
  { id: 'invite', label: 'Invite' }
];
const roles = [
  { value: 'writer', label: 'Writer', description: 'Drafts, edits and publishes.' },
  { value: 'editor', label: 'Editor', description: 'Reviews and schedules other people’s work.' },
  { value: 'lead', label: 'Team lead', description: 'Sets goals and manages the workspace.' }
];
const sources = ['A friend', 'Search', 'Newsletter', 'Podcast', 'Social media', 'Conference'];
const services = [
  { id: 'slack', name: 'Slack', note: 'Channels and threads', Logo: Slack },
  { id: 'drive', name: 'Google Drive', note: 'Docs and folders', Logo: GoogleDrive },
  { id: 'dropbox', name: 'Dropbox', note: 'Shared folders', Logo: Dropbox },
  { id: 'loom', name: 'Loom', note: 'Video walkthroughs', Logo: Loom },
  { id: 'zoom', name: 'Zoom', note: 'Meeting recordings', Logo: Zoom },
  { id: 'discord', name: 'Discord', note: 'Community servers', Logo: Discord }
];
const limit = 2;
const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// The preview pane renders what the answers will produce, so every step has a visible payoff.
function Preview({ name, role, workspace, picked }) {
  return (
    <section aria-label='Workspace preview' className='bg-surface-muted grid gap-3 rounded-lg border p-3 text-sm'>
      <div className='flex items-center gap-2'>
        <span className='bg-accent text-accent-foreground grid size-7 place-items-center rounded-md text-xs font-semibold'>{(workspace || 'W')[0].toUpperCase()}</span>
        <span className='grid min-w-0'>
          <span className='truncate font-medium'>{workspace || 'Your workspace'}</span>
          <span className='text-text-muted truncate text-xs'>{slugify(workspace) || 'workspace'}.gaudi.app</span>
        </span>
      </div>
      <ul className='bg-surface grid divide-y rounded-md border'>
        {['Welcome to your inbox', 'Draft: Spring issue', 'Review: Field notes'].map((subject, index) => (
          <li key={subject} className='flex items-center gap-2 px-2.5 py-2'>
            <span aria-hidden='true' className={index ? 'bg-border size-1.5 rounded-full' : 'bg-accent size-1.5 rounded-full'} />
            <span className='min-w-0 flex-1 truncate text-xs'>{subject}</span>
          </li>
        ))}
      </ul>
      <div className='flex items-center gap-2'>
        <Avatar size='sm'>
          <AvatarFallback>{(name || 'Y')[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className='min-w-0 flex-1 truncate text-xs'>{name || 'You'}</span>
        {role ? <Badge size='sm' variant='info-light'>{roles.find((item) => item.value === role)?.label}</Badge> : null}
      </div>
      {picked.length ? <p className='text-text-muted text-xs'>Importing from {picked.map((id) => services.find((service) => service.id === id).name).join(' and ')}</p> : null}
    </section>
  );
}

export function Pattern() {
  const [indicator, setIndicator] = useState('steps');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [source, setSource] = useState([]);
  const [workspace, setWorkspace] = useState('');
  const [picked, setPicked] = useState([]);
  const [invites, setInvites] = useState('');
  const [checked, setChecked] = useState(false);
  const valid = [Boolean(name.trim()), Boolean(role), true, Boolean(workspace.trim()), true, true];
  return (
    <div className='grid w-full max-w-4xl gap-3'>
      <ToggleGroup aria-label='Progress style' type='single' variant='outline' size='sm' spacing={0} value={indicator} onValueChange={(next) => setIndicator(next || indicator)} className='justify-self-end'>
        <ToggleGroupItem value='steps'>Steps</ToggleGroupItem>
        <ToggleGroupItem value='progress'>Progress bar</ToggleGroupItem>
      </ToggleGroup>
      <div className='rounded-xl border p-5'>
        <Wizard
          title='Set up your workspace'
          description='Six quick questions; you can change every answer later.'
          steps={steps}
          indicator={indicator}
          validateStep={(index) => {
            if (!valid[index]) setChecked(true);
            return valid[index];
          }}
          onComplete={() => new Promise((resolve) => setTimeout(resolve, 400))}
          completeLabel='Open my workspace'
          completionTitle={`Welcome to ${workspace}`}
          completionDescription={picked.length ? 'Your imports are running; we will email you when they finish.' : 'Your inbox is ready.'}
          aside={<Preview name={name} role={role} workspace={workspace} picked={picked} />}
        >
          {(step) =>
            step === 0 ? (
              <Field>
                <FieldLabel>What should we call you?</FieldLabel>
                <Input autoComplete='name' value={name} invalid={checked && !name.trim()} onChange={(event) => setName(event.target.value)} />
                <FieldError>{checked && !name.trim() ? 'Add your name.' : null}</FieldError>
              </Field>
            ) : step === 1 ? (
              <div className='grid gap-2'>
                <RadioGroup label='What best describes your work?' variant='cards' value={role} onValueChange={setRole} options={roles} />
                {checked && !role ? <p className='text-danger text-sm'>Pick the closest role.</p> : null}
              </div>
            ) : step === 2 ? (
              <div className='grid gap-2'>
                <p id='source-label' className='text-sm font-medium'>How did you hear about us? <span className='text-text-muted font-normal'>· optional</span></p>
                <ToggleGroup aria-labelledby='source-label' type='multiple' variant='outline' size='sm' spacing={2} value={source} onValueChange={setSource} className='flex-wrap'>
                  {sources.map((item) => <ToggleGroupItem key={item} value={item}>{item}</ToggleGroupItem>)}
                </ToggleGroup>
              </div>
            ) : step === 3 ? (
              <Field>
                <FieldLabel>Workspace name</FieldLabel>
                <Input value={workspace} invalid={checked && !workspace.trim()} onChange={(event) => setWorkspace(event.target.value)} />
                <FieldDescription>Your address will be {slugify(workspace) || 'workspace'}.gaudi.app</FieldDescription>
                <FieldError>{checked && !workspace.trim() ? 'Name the workspace.' : null}</FieldError>
              </Field>
            ) : step === 4 ? (
              <div className='grid gap-3'>
                <div className='flex items-baseline justify-between gap-3'>
                  <p id='import-label' className='text-sm font-medium'>Bring your work along</p>
                  <span className='text-text-muted text-xs' aria-live='polite'>{picked.length} of {limit} picked</span>
                </div>
                <ToggleGroup aria-labelledby='import-label' type='multiple' variant='outline' spacing={2} value={picked} onValueChange={(next) => setPicked(next.slice(0, limit))} className='grid! grid-cols-1 sm:grid-cols-2'>
                  {services.map(({ id, name: label, note, Logo }) => (
                    <ToggleGroupItem
                      key={id}
                      value={id}
                      disabled={picked.length >= limit && !picked.includes(id)}
                      className='h-auto! justify-start gap-3 p-3 text-start data-[state=on]:ring-2 data-[state=on]:ring-accent'
                    >
                      <Logo className='size-5 shrink-0' aria-hidden='true' />
                      <span className='grid min-w-0 flex-1'>
                        <span className='font-medium'>{label}</span>
                        <span className='text-text-muted truncate text-xs font-normal'>{note}</span>
                      </span>
                      {picked.includes(id) ? <RegistryIcon lucide='CheckIcon' className='text-accent size-4' /> : null}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <p className='text-text-muted text-xs'>Your plan imports from two services at a time. Add more once these finish.</p>
              </div>
            ) : (
              <Field>
                <FieldLabel>Invite teammates <span className='text-text-muted font-normal'>· optional</span></FieldLabel>
                <Textarea rows={3} placeholder='ana@example.com, li@example.com' value={invites} onChange={(event) => setInvites(event.target.value)} />
                <FieldDescription>They join as writers. You can skip this and invite people later.</FieldDescription>
              </Field>
            )
          }
        </Wizard>
      </div>
    </div>
  );
}
