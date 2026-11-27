'use client';
import { useState } from 'react';
import Input from '@gaudi/design-system/core/Input';
import { Label } from '@gaudi/design-system/core/Field';
import Card from '@gaudi/design-system/core/Card';
import { StatusDot } from '@gaudi/design-system/core/Pill';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@gaudi/design-system/core/ButtonGroup';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const team = [
  { name: 'Anouk Varga', src: '/avatars/person-41.svg', fallback: 'AV' },
  { name: 'Sabine Okafor', src: '/avatars/person-20.svg', fallback: 'SO' },
  { name: 'Ilse Valtonen', src: '/avatars/person-24.svg', fallback: 'IV' }
];
const initialDocs = {
  main: {
    title: 'Release notes',
    body: 'The editor now keeps your reading position when you switch branches.',
    status: 'Draft'
  },
  develop: {
    title: 'Editor shortcuts',
    body: 'Use the branch menu to switch between the release notes and the shortcut guide.',
    status: 'Draft'
  },
  'feature/auth': {
    title: 'Sign-in changes',
    body: 'Readers can open an invitation link and return to the article they started.',
    status: 'Draft'
  }
};
export function Pattern() {
  const [documents, setDocuments] = useState(initialDocs);
  const [current, setCurrent] = useState('main');
  const [panel, setPanel] = useState('');
  const [history, setHistory] = useState([]);
  const [members, setMembers] = useState(team.map((entry) => entry.name));
  const [memberName, setMemberName] = useState('');
  const [schedule, setSchedule] = useState('');
  const doc = documents[current];
  const log = (message) => setHistory((items) => [`${current} · ${message}`, ...items]);
  const changeStatus = (status) => {
    setDocuments((docs) => ({ ...docs, [current]: { ...docs[current], status } }));
    log(`${doc.title}: ${status}`);
    setPanel('');
  };
  const duplicate = () => {
    let copy = `${current}-copy`;
    while (documents[copy]) copy += '-copy';
    setDocuments((docs) => ({ ...docs, [copy]: { ...doc, title: `${doc.title} (copy)`, status: 'Draft' } }));
    log(`Copied to ${copy}`);
    setCurrent(copy);
    setPanel('');
  };
  const removed = doc.status === 'Deleted' || doc.status === 'Archived';
  return (
    <section className='mx-auto grid w-full max-w-2xl gap-4' aria-label='Local editor'>
      <div className='flex flex-wrap items-center gap-2'>
        <ButtonGroup aria-label='Branch'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>
                <RegistryIcon aria-hidden='true' lucide='GitMergeIcon' />
                {current}
                <RegistryIcon aria-hidden='true' lucide='ChevronDownIcon' className='size-3.5 opacity-60' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-48'>
              <DropdownMenuLabel>Switch branch</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={current}
                onValueChange={(branch) => {
                  setCurrent(branch);
                  setPanel('');
                }}
              >
                {Object.keys(documents).map((branch) => (
                  <DropdownMenuRadioItem key={branch} value={branch}>
                    <RegistryIcon aria-hidden='true' lucide='GitBranchIcon' />
                    {branch}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <ButtonGroupText className='gap-1.5 border border-border px-2.5 text-xs text-text-muted'>
            <StatusDot pulse className='bg-success' />
            {current === 'main' ? 'Production' : 'Preview branch'}
          </ButtonGroupText>
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              log('Checked the local branch state');
              setPanel('history');
            }}
            aria-label='Refresh'
          >
            <RegistryIcon aria-hidden='true' lucide='RefreshCwIcon' />
          </Button>
        </ButtonGroup>

        <ButtonGroup aria-label='Team'>
          <ButtonGroupText className='gap-2 border border-border px-2'>
            <AvatarGroup>
              {team.map((member) => (
                <Avatar key={member.name} className='size-5'>
                  <AvatarImage src={member.src} alt={member.name} />
                  <AvatarFallback>{member.fallback}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <span className='text-xs font-medium text-text-muted'>{team.length} live</span>
          </ButtonGroupText>
          <Button variant='outline' size='icon' onClick={() => setPanel('members')} aria-label='Invite'>
            <RegistryIcon aria-hidden='true' lucide='PlusIcon' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setPanel('history')}
            aria-label='View recent activity'
          >
            <RegistryIcon aria-hidden='true' lucide='ClockIcon' />
          </Button>
        </ButtonGroup>

        <div className='flex flex-wrap items-center gap-2'>
          <Button
            variant='outline'
            disabled={removed}
            aria-pressed={panel === 'preview'}
            onClick={() => setPanel(panel === 'preview' ? '' : 'preview')}
          >
            <RegistryIcon aria-hidden='true' lucide='EyeIcon' />
            Preview
          </Button>
          <ButtonGroup aria-label='Publish' className='**:data-[slot=button]:border-x-0'>
            <Button disabled={removed || doc.status === 'Published'} onClick={() => changeStatus('Published')}>
              <RegistryIcon aria-hidden='true' lucide='SendIcon' />
              Publish
            </Button>
            <ButtonGroupSeparator className='bg-ui-primary-foreground/20' />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='icon' aria-label='More publish options'>
                  <RegistryIcon aria-hidden='true' lucide='ChevronDownIcon' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem onSelect={() => setPanel('schedule')}>
                  <RegistryIcon aria-hidden='true' lucide='CalendarIcon' />
                  Schedule for later
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => changeStatus('Draft')}>
                  <RegistryIcon aria-hidden='true' lucide='FileIcon' />
                  Save as draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' aria-label='More actions'>
                <RegistryIcon aria-hidden='true' lucide='MoreHorizontalIcon' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setPanel('members')}>
                  <RegistryIcon aria-hidden='true' lucide='UserIcon' />
                  Manage members
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => duplicate()}>
                  <RegistryIcon aria-hidden='true' lucide='CopyIcon' />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPanel('history')}>
                  <RegistryIcon aria-hidden='true' lucide='HistoryIcon' />
                  View history
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => changeStatus('Archived')}>
                  <RegistryIcon aria-hidden='true' lucide='ArchiveIcon' />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant='destructive' onSelect={() => setPanel('delete')}>
                <RegistryIcon aria-hidden='true' lucide='TrashIcon' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card
        variant='outline'
        padding='sm'
        title={panel === 'preview' ? 'Reader preview' : doc.title}
        subtitle={`${current} · ${doc.status}`}
      >
        {panel === 'preview' ? (
          <article className='grid gap-2'>
            <h3 className='font-semibold'>{doc.title}</h3>
            <p>{doc.body}</p>
          </article>
        ) : null}
        {!panel && !removed ? <p className='text-sm'>{doc.body}</p> : null}
        {!panel && removed ? (
          <Button size='sm' variant='outline' onClick={() => changeStatus('Draft')}>
            Restore draft
          </Button>
        ) : null}
        {panel === 'history' ? (
          <section aria-label='Recent activity'>
            <h3 className='font-medium'>Recent activity</h3>
            {history.length ? (
              <ul className='list-disc ps-5 text-sm'>
                {history.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className='text-sm'>No edits yet in this session.</p>
            )}
          </section>
        ) : null}
        {panel === 'members' ? (
          <section className='grid gap-2' aria-label='Editor team'>
            <ul className='text-sm'>
              {members.map((member) => (
                <li key={member}>{member}</li>
              ))}
            </ul>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const name = memberName.trim();
                if (name && !members.includes(name)) setMembers((list) => [...list, name]);
                setMemberName('');
              }}
              className='grid justify-items-start gap-2'
            >
              <Label>
                Collaborator name
                <Input value={memberName} onChange={(event) => setMemberName(event.target.value)} />
              </Label>
              <Button
                size='sm'
                type='submit'
                disabled={!memberName.trim() || members.includes(memberName.trim())}
              >
                Add locally
              </Button>
            </form>
          </section>
        ) : null}
        {panel === 'schedule' ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (schedule) changeStatus(`Scheduled for ${schedule.replace('T', ' ')}`);
            }}
            className='grid justify-items-start gap-2'
          >
            <Label>
              Publication date and time
              <Input
                type='datetime-local'
                required
                value={schedule}
                onChange={(event) => setSchedule(event.target.value)}
              />
            </Label>
            <Button size='sm' type='submit' disabled={!schedule}>
              Schedule publication
            </Button>
          </form>
        ) : null}
        {panel === 'delete' ? (
          <div className='grid justify-items-start gap-2'>
            <p>Delete {doc.title} from this local branch?</p>
            <div className='flex gap-2'>
              <Button size='sm' tone='destructive' onClick={() => changeStatus('Deleted')}>
                Delete document
              </Button>
              <Button size='sm' variant='outline' onClick={() => setPanel('')}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </section>
  );
}
