'use client';
import { useRef, useState } from 'react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ButtonGroup } from '@gaudi/design-system/core/ButtonGroup';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
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
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';
import { cn } from '@gaudi/design-system/utilities/cn';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const Icon = ({ name, className }) => <RegistryIcon lucide={name} aria-hidden='true' className={className} />;
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
function Menu({ label, icon, items, children }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || <Button variant='outline' size='icon' aria-label={label}><Icon name={icon} /></Button>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        {items.map((item) => <DropdownMenuItem key={item}>{item}</DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function SearchInput({ icon = 'SearchIcon', label }) {
  return (
    <InputGroup>
      <InputGroupAddon><Icon name={icon} /></InputGroupAddon>
      <InputGroupInput aria-label={label} placeholder={label} />
    </InputGroup>
  );
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
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-3'>
      <Row label='Menus around an input'>
        <ButtonGroup className='w-full'>
          <Menu items={records}>
            <Button variant='outline'>
              <Icon name='ListFilterIcon' />
              Filter
              <Icon name='ChevronDownIcon' className='opacity-60' />
            </Button>
          </Menu>
          <Input ref={filterRef} aria-label='Filter records' placeholder='Filter records...' value={filter} onChange={(event) => setFilter(event.target.value)} />
          <Button variant='outline' size='icon' aria-label='Clear filter' onClick={() => { setFilter(''); filterRef.current?.focus(); }}><Icon name='XIcon' /></Button>
        </ButtonGroup>
        <ButtonGroup className='min-w-0 flex-1'>
          <SearchInput label='Search records...' />
          <Menu label='Record options' icon='EllipsisVerticalIcon' items={records} />
        </ButtonGroup>
        <ButtonGroup className='min-w-0 flex-1'>
          <SearchInput icon='FileIcon' label='File name...' />
          <Menu label='Create' icon='PlusIcon' items={['New file', 'New folder', 'New workspace']} />
        </ButtonGroup>
        <ButtonGroup className='w-full'>
          <SearchInput label='Search everything...' />
          <Menu items={records}><Button>Search</Button></Menu>
        </ButtonGroup>
      </Row>
      <Row label='Nested groups'>
        <ButtonGroup className='w-full'>
          <ButtonGroup>
            <Button variant='outline' size='icon' aria-label='Attach'><Icon name='PlusIcon' /></Button>
          </ButtonGroup>
          <ButtonGroup className='flex-1'>
            <InputGroup>
              <InputGroupInput aria-label='Send a message' placeholder='Send a message...' />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupAddon align='inline-end'><Icon name='AudioLinesIcon' /></InputGroupAddon>
                  </TooltipTrigger>
                  <TooltipContent>Voice mode</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </InputGroup>
          </ButtonGroup>
          <ButtonGroup>
            <Button size='icon' aria-label='Send'><Icon name='SendIcon' /></Button>
          </ButtonGroup>
        </ButtonGroup>
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
          <Button variant='outline' size='icon' aria-label='Add tag'><Icon name='PlusIcon' /></Button>
          <Button variant='outline' size='icon' aria-label='Settings'><Icon name='Settings2Icon' /></Button>
        </ButtonGroup>
        <ButtonGroup className='w-full min-w-0 sm:w-auto sm:flex-1'>
          <Select defaultValue='done'>
            <SelectTrigger aria-label='Status' className='w-32 shrink-0 sm:w-36'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent position='popper'>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <span className='flex items-center gap-2'>
                    <span className={cn('size-1.5 rounded-full', status.color)} />
                    {status.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input aria-label='Search tasks' placeholder='Search tasks...' className='min-w-0' />
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
                    <Icon name={item.icon} className='size-3.5 opacity-60' />
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
