'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../src/components/core/Select/parts/select.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
import { EditableField, validators } from '../../../../src/components/blocks/Forms/Forms.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const people = {
  maya: { name: 'Maya Chen', photo: '/avatars/women/44.jpg' },
  sam: { name: 'Sam Rivera', photo: '/avatars/men/32.jpg' },
  alex: { name: 'Alex Morgan', photo: '/avatars/women/68.jpg' },
  omar: { name: 'Omar Haddad', photo: '/avatars/men/75.jpg' }
};
const priorities = { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' };
const statuses = { open: ['Open', 'info-light'], pending: ['Waiting on customer', 'warning-light'], solved: ['Solved', 'success-light'] };
const email = validators.email();

function SelectControl({ options, ...props }) {
  return (
    <Select value={props.value} onValueChange={(value) => props.onChange(value)}>
      <SelectTrigger id={props.id} ref={props.ref} onKeyDown={props.onKeyDown} aria-describedby={props['aria-describedby']} className='w-full sm:w-56'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent position='popper'>
        {Object.entries(options).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export function Pattern() {
  const [ticket, setTicket] = useState({
    subject: 'Export to CSV drops the last column',
    requester: 'jordan@contoso.example',
    priority: 'high',
    status: 'open',
    summary: 'Exports from the Reports page are missing the “Region” column since Tuesday’s release.',
    tags: ['exports', 'regression'],
    owners: ['maya', 'sam']
  });
  const [tag, setTag] = useState('');
  const [log, setLog] = useState('');
  const save = (name, label) => async (value) => {
    // Stand-in for a request; the row stays open with the message if this throws.
    await new Promise((resolve) => setTimeout(resolve, 250));
    setTicket((current) => ({ ...current, [name]: value }));
    setLog(`${label} updated.`);
  };
  const [statusLabel, statusTone] = statuses[ticket.status];
  const breached = ticket.priority === 'urgent';

  return (
    <article aria-labelledby='ticket-title' className='mx-auto grid w-full max-w-3xl gap-4 rounded-lg border p-5 sm:p-6'>
      <header className='grid gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-text-muted font-mono text-xs'>#4821</span>
          <Badge size='sm' variant={statusTone}>{statusLabel}</Badge>
          <Badge size='sm' variant={breached ? 'destructive-light' : 'attention-light'}>
            <RegistryIcon lucide='ClockIcon' aria-hidden='true' />
            {breached ? 'First reply overdue by 12 min' : 'First reply due in 2h 40m'}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='xs' variant='outline' tone='neutral' className='ms-auto'>
                Change status
                <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {Object.entries(statuses).map(([value, [label]]) => (
                <DropdownMenuItem
                  key={value}
                  onSelect={() => {
                    setTicket((current) => ({ ...current, status: value }));
                    setLog(`Status set to ${label.toLowerCase()}.`);
                  }}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h2 id='ticket-title' className='text-lg font-semibold'>{ticket.subject}</h2>
      </header>
      <div className='divide-y border-y'>
        <EditableField label='Subject' value={ticket.subject} onSave={save('subject', 'Subject')} validate={validators.required('The subject cannot be empty.')} />
        <EditableField label='Requester' value={ticket.requester} type='email' onSave={save('requester', 'Requester')} validate={(value) => validators.required('Enter the requester’s email.')(value) || email(value)} />
        <EditableField label='Priority' value={ticket.priority} format={(value) => priorities[value]} onSave={save('priority', 'Priority')} renderControl={(props) => <SelectControl {...props} options={priorities} />} />
        <EditableField
          label='Summary'
          value={ticket.summary}
          description='Shown to anyone who picks the ticket up.'
          onSave={save('summary', 'Summary')}
          validate={validators.maxLength(280)}
          renderControl={(props) => <Textarea {...props} rows={3} />}
        />
        <div className='grid gap-2 py-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-4'>
          <span id='ticket-tags-label' className='text-text-muted text-sm'>Tags</span>
          <div className='flex flex-wrap items-center gap-1.5'>
            <ul aria-labelledby='ticket-tags-label' className='contents'>
              {ticket.tags.map((item) => (
                <li key={item}>
                  <Badge variant='secondary' className='gap-1 pe-0.5'>
                    {item}
                    <button type='button' aria-label={`Remove tag ${item}`} onClick={() => setTicket((current) => ({ ...current, tags: current.tags.filter((other) => other !== item) }))} className='hover:bg-surface-muted grid size-4 place-items-center rounded-xs'>
                      <RegistryIcon lucide='XIcon' aria-hidden='true' className='size-3' />
                    </button>
                  </Badge>
                </li>
              ))}
            </ul>
            <form
              aria-label='Add a tag'
              onSubmit={(event) => {
                event.preventDefault();
                const next = tag.trim().toLowerCase();
                if (next && !ticket.tags.includes(next)) setTicket((current) => ({ ...current, tags: [...current.tags, next] }));
                setTag('');
              }}
            >
              <label htmlFor='ticket-new-tag' className='sr-only'>New tag</label>
              <Input id='ticket-new-tag' value={tag} onChange={(event) => setTag(event.target.value)} placeholder='Add tag' className='w-28' inputClassName='h-7 min-h-7 text-xs' />
            </form>
          </div>
        </div>
        <div className='grid gap-2 py-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-4'>
          <span id='ticket-owners-label' className='text-text-muted text-sm'>Owners</span>
          <div className='flex flex-wrap items-center gap-1.5'>
            <ul aria-labelledby='ticket-owners-label' className='contents'>
              {ticket.owners.map((id) => (
                <li key={id} className='bg-surface-muted flex items-center gap-1.5 rounded-md border py-0.5 ps-0.5 pe-1 text-xs'>
                  <Avatar className='size-5'>
                    <AvatarImage src={people[id].photo} alt='' />
                    <AvatarFallback>{people[id].name[0]}</AvatarFallback>
                  </Avatar>
                  {people[id].name}
                  <button type='button' aria-label={`Remove ${people[id].name}`} onClick={() => setTicket((current) => ({ ...current, owners: current.owners.filter((other) => other !== id) }))} className='hover:bg-surface grid size-4 place-items-center rounded-xs'>
                    <RegistryIcon lucide='XIcon' aria-hidden='true' className='size-3' />
                  </button>
                </li>
              ))}
            </ul>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='xs' variant='ghost' tone='neutral' disabled={ticket.owners.length === Object.keys(people).length}>
                  <RegistryIcon lucide='UserPlusIcon' aria-hidden='true' />
                  Add owner
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(people)
                  .filter(([id]) => !ticket.owners.includes(id))
                  .map(([id, person]) => (
                    <DropdownMenuItem key={id} onSelect={() => setTicket((current) => ({ ...current, owners: [...current.owners, id] }))}>
                      {person.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <p role='status' className='text-text-muted min-h-5 text-sm'>{log}</p>
    </article>
  );
}
