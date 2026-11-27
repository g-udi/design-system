'use client';
import { StatusDot } from '@gaudi/design-system/core/Pill';
import { useEffect, useRef, useState } from 'react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ButtonGroup } from '@gaudi/design-system/core/ButtonGroup';
import DropdownMenu, {
  DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem
} from '@gaudi/design-system/core/DropdownMenu';
import { useFileUpload } from '@gaudi/design-system/core/FileUpload';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
import {
  SelectRoot as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const records = ['All records', 'Recent', 'Archived'];
const users = [
  { id: '1', name: 'Anouk Varga', avatar: '/avatars/person-41.svg', initials: 'AV' },
  { id: '2', name: 'Sabine Okafor', avatar: '/avatars/person-20.svg', initials: 'SO' },
  { id: '3', name: 'Rafe Okonkwo', avatar: '/avatars/person-31.svg', initials: 'RO' }
];
const statuses = [
  { value: 'progress', label: 'In progress', color: 'bg-info' },
  { value: 'done', label: 'Completed', color: 'bg-success' },
  { value: 'pending', label: 'Pending', color: 'bg-warning' },
  { value: 'rejected', label: 'Rejected', color: 'bg-danger' }
];
const environments = [
  { value: 'production', label: 'Production', icon: 'GlobeIcon' },
  { value: 'staging', label: 'Staging', icon: 'LayersIcon' },
  { value: 'development', label: 'Development', icon: 'TerminalIcon' }
];
const ranges = { recent: ['Last hour', 'Last 6 hours', 'Last 24 hours'], extended: ['Last 7 days', 'Last 30 days'] };
function RecordScopeMenu({ value, onValueChange, trigger }) {
  return (
    <DropdownMenu trigger={trigger}>
      <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
        {records.map((scope) => <DropdownMenuRadioItem key={scope} value={scope}>{scope}</DropdownMenuRadioItem>)}
      </DropdownMenuRadioGroup>
    </DropdownMenu>
  );
}
function SearchInput({ icon = 'SearchIcon', label, value, onChange }) {
  return (
    <InputGroup>
      <InputGroupAddon><RegistryIcon aria-hidden='true' lucide={icon} /></InputGroupAddon>
      <InputGroupInput aria-label={label} placeholder={label} value={value} onChange={(event) => onChange(event.target.value)} />
    </InputGroup>
  );
}
function Message({ text, file }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setUrl(preview);
    return () => URL.revokeObjectURL(preview);
  }, [file]);
  return <li>{text}{url && <Button asChild variant='link' size='sm'><a href={url} download={file.name}>{file.name}</a></Button>}</li>;
}
function Row({ label, children }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <span className='text-xs text-text-muted'>{label}</span>
      <div className='flex flex-wrap items-center gap-2'>{children}</div>
    </div>
  );
}
export function Pattern() {
  const filterRef = useRef(null);
  const [filter, setFilter] = useState('');
  const [user, setUser] = useState('2');
  const [env, setEnv] = useState('development');
  const [range, setRange] = useState('Last 6 hours');
  const [scope, setScope] = useState('All records');
  const [entries, setEntries] = useState([
    { name: 'Design systems', scope: 'Recent' }, { name: 'Reader notes', scope: 'Recent' }, { name: 'Archive export', scope: 'Archived' }
  ]);
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');
  const [{ files: attachments }, { clearFiles, getInputProps, openFileDialog }] = useFileUpload();
  const attachment = attachments[0]?.file;
  const [messages, setMessages] = useState([]);
  const [watchers, setWatchers] = useState([]);
  const visible = entries.filter((entry) => (scope === 'All records' || scope === entry.scope) && entry.name.toLowerCase().includes(filter.toLowerCase()));
  const create = (type) => {
    const name = fileName.trim() || 'Untitled ' + type.slice(4).toLowerCase();
    setEntries((items) => [...items, { name, scope: 'Recent' }]);
    setFileName('');
    setScope('Recent');
    setFilter(name);
  };
  const send = (event) => {
    event.preventDefault();
    if (!message.trim() && !attachment) return;
    setMessages((items) => [...items, { text: message.trim(), file: attachment }]);
    setMessage('');
    clearFiles();
  };

  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-3'>
      <Row label='Menus around an input'>
        <ButtonGroup className='w-full'>
          <RecordScopeMenu value={scope} onValueChange={setScope} trigger={
            <Button variant='outline'>
              <RegistryIcon aria-hidden='true' lucide='ListFilterIcon' />
              {scope}
              <RegistryIcon aria-hidden='true' lucide='ChevronDownIcon' className='opacity-60' />
            </Button>
          } />
          <Input ref={filterRef} aria-label='Filter records' placeholder='Filter records...' value={filter} onChange={(event) => setFilter(event.target.value)} />
          <Button variant='outline' size='icon' aria-label='Clear filter' onClick={() => { setFilter(''); filterRef.current?.focus(); }}><RegistryIcon aria-hidden='true' lucide='XIcon' /></Button>
        </ButtonGroup>
        <ButtonGroup className='min-w-0 flex-1'>
          <SearchInput label='Search records...' value={filter} onChange={setFilter} />
          <RecordScopeMenu value={scope} onValueChange={setScope} trigger={
            <Button variant='outline' size='icon' aria-label='Record options'><RegistryIcon aria-hidden='true' lucide='EllipsisVerticalIcon' /></Button>
          } />
        </ButtonGroup>
        <ButtonGroup className='min-w-0 flex-1'>
          <SearchInput icon='FileIcon' label='File name...' value={fileName} onChange={setFileName} />
          <DropdownMenu trigger={<Button variant='outline' size='icon' aria-label='Create'><RegistryIcon aria-hidden='true' lucide='PlusIcon' /></Button>}>
            {['New file', 'New folder', 'New workspace'].map((item) => (
              <DropdownMenuItem key={item} onSelect={() => create(item)}>{item}</DropdownMenuItem>
            ))}
          </DropdownMenu>
        </ButtonGroup>
        <ul className='w-full list-none p-0 text-sm' aria-label='Matching records'>{visible.map((entry, index) => <li key={entry.name + index}>{entry.name}</li>)}</ul>
        {!visible.length && <p className='text-xs text-text-muted'>No matching records</p>}
      </Row>
      <Row label='Nested groups'>
        <form onSubmit={send} className='w-full'>
          <ButtonGroup className='w-full'>
            <ButtonGroup>
              <Button type='button' variant='outline' size='icon' aria-label='Attach file' onClick={openFileDialog}><RegistryIcon aria-hidden='true' lucide='PlusIcon' /></Button>
              <input {...getInputProps({ 'aria-label': 'Choose message attachment' })} hidden />
            </ButtonGroup>
            <ButtonGroup className='min-w-0 flex-1'>
              <InputGroup><InputGroupInput aria-label='Send a message' placeholder='Send a message...' value={message} onChange={(event) => setMessage(event.target.value)} /></InputGroup>
            </ButtonGroup>
            <ButtonGroup>
              <Button type='submit' size='icon' aria-label='Send' disabled={!message.trim() && !attachment}><RegistryIcon aria-hidden='true' lucide='SendIcon' /></Button>
            </ButtonGroup>
          </ButtonGroup>
          {attachment && <p className='text-xs text-text-muted'>Attached: {attachment.name}</p>}
        </form>
        {messages.length > 0 && <ol className='w-full space-y-1 text-sm' aria-label='Local conversation'>{messages.map((item, index) => <Message key={index} {...item} />)}</ol>}
      </Row>
      <Row label='Selects'>
        <ButtonGroup>
          <Select value={user} onValueChange={setUser}>
            <SelectTrigger aria-label='Assignee' className='w-44'>
              <SelectValue placeholder='Assignee' />
            </SelectTrigger>
            <SelectContent position='popper'>
              <SelectGroup>
                <SelectLabel>Team members</SelectLabel>
                {users.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    <span className='flex items-center gap-2'>
                      <Avatar className='size-5'>
                        <AvatarImage src={item.avatar} alt={item.name} />
                        <AvatarFallback>{item.initials}</AvatarFallback>
                      </Avatar>
                      <span className='truncate'>{item.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant='outline' size='icon' aria-label='Add assignee to watchers' disabled={watchers.includes(user)} onClick={() => setWatchers((items) => [...items, user])}><RegistryIcon aria-hidden='true' lucide='PlusIcon' /></Button>
        </ButtonGroup>
        {watchers.length > 0 && <p className='w-full text-xs text-text-muted'>Watching: {watchers.map((id) => users.find((item) => item.id === id).name).join(', ')}</p>}
        <ButtonGroup className='w-full min-w-0 sm:w-auto sm:flex-1'>
          <Select defaultValue='done'>
            <SelectTrigger aria-label='Status' className='w-32 shrink-0 sm:w-36'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent position='popper'>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <span className='flex items-center gap-2'>
                    <StatusDot className={status.color} />
                    {status.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input aria-label='Task title' placeholder='Task title...' className='min-w-0' />
        </ButtonGroup>
        <ButtonGroup>
          <Select value={env} onValueChange={setEnv}>
            <SelectTrigger aria-label='Environment' className='w-32 sm:w-40'>
              <SelectValue placeholder='Environment' />
            </SelectTrigger>
            <SelectContent position='popper' align='start'>
              {environments.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <span className='flex items-center gap-2'>
                    <RegistryIcon aria-hidden='true' lucide={item.icon} className='size-3.5 opacity-60' />
                    {item.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger aria-label='Time range' className='w-32 sm:w-40'>
              <SelectValue placeholder='Time range' />
            </SelectTrigger>
            <SelectContent position='popper'>
              <SelectGroup>
                {ranges.recent.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Extended retention</SelectLabel>
                {ranges.extended.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </ButtonGroup>
      </Row>
    </div>
  );
}
