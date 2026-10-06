'use client';
import { useState } from 'react';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import { cn } from '@gaudi/design-system/utilities/cn';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import {
  FieldRoot as Field,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const methodColors = {
  GET: 'text-success',
  POST: 'text-info',
  PUT: 'text-warning',
  PATCH: 'text-accent',
  DELETE: 'text-danger'
};

// A ghost button in an addon that opens a menu of choices and shows the current one.
function Choice({ label, value, options, onChange, align = 'start', className, children }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <InputGroupButton variant='ghost' size='xs' aria-label={`${label}: ${value}`} className={cn('gap-1.5', className)}>
          {children}
          {value}
          <RegistryIcon lucide='ChevronDownIcon' className='size-3 opacity-60' aria-hidden='true' />
        </InputGroupButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className='min-w-28'>
        {options.map((option) => (
          <DropdownMenuItem key={option} onSelect={() => onChange(option)}>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Cell({ id, label, className, children }) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id} className='text-xs font-normal text-text-muted'>{label}</FieldLabel>
      {children}
    </Field>
  );
}

export function Pattern() {
  const [feedback, setFeedback] = useState('');
  const [shareUrl, setShareUrl] = useState('https://gaudi.dev/runbooks/q2-review');
  const [endpoint, setEndpoint] = useState('/v1/agents/run');
  const { copy, copiedText } = useCopyToClipboard({ onCopy: () => setFeedback('Link copied.'), onError: () => setFeedback('Copy failed. Try again.') });
  const [code, setCode] = useState('+1');
  const [region, setRegion] = useState('Global');
  const [role, setRole] = useState('Admin');
  const [category, setCategory] = useState('All');
  const [method, setMethod] = useState('GET');
  const [visibility, setVisibility] = useState('Private');
  return (
    <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
      <Cell id='ig-phone' label='Leading country code'>
        <InputGroup>
          <InputGroupAddon>
            <Choice label='Country code' value={code} options={['+1', '+44', '+61']} onChange={setCode} className='tabular-nums' />
          </InputGroupAddon>
          <InputGroupInput id='ig-phone' type='tel' placeholder='123 456 7890' />
        </InputGroup>
      </Cell>
      <Cell id='ig-member' label='Member and role'>
        <InputGroup>
          <InputGroupAddon className='pr-1'>
            <Avatar className='size-5'>
              <AvatarImage src='/avatars/person-41.svg' alt='Anouk Varga' />
              <AvatarFallback>AV</AvatarFallback>
            </Avatar>
          </InputGroupAddon>
          <InputGroupInput id='ig-member' defaultValue='@alexjohnson' className='pl-1!' />
          <InputGroupAddon align='inline-end'>
            <Choice label='Role' value={role} options={['Admin', 'Member', 'Viewer']} onChange={setRole} align='end' />
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-category' label='Pill with category'>
        <InputGroup className='rounded-full'>
          <InputGroupInput id='ig-category' placeholder='Search products' className='rounded-full px-4' />
          <InputGroupAddon align='inline-end'>
            <Choice label='Category' value={category} options={['All', 'Electronics', 'Clothing', 'Home']} onChange={setCategory} align='end' className='rounded-full' />
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-request' label='Method and send'>
        <InputGroup>
          <InputGroupAddon>
            <Choice label='HTTP method' value={method} options={Object.keys(methodColors)} onChange={setMethod} className={cn('font-mono', methodColors[method])} />
          </InputGroupAddon>
          <InputGroupInput id='ig-request' value={endpoint} onChange={(event) => setEndpoint(event.target.value)} className='font-mono text-xs' />
          <InputGroupAddon align='inline-end'>
            <InputGroupButton size='xs' onClick={() => setFeedback(`${method} ${endpoint} prepared in this demo. No request was sent.`)}>Send</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-region' className='sm:col-span-2' label='Trailing region with icon'>
        <InputGroup>
          <InputGroupAddon>
            <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput id='ig-region' placeholder='Search companies…' />
          <InputGroupAddon align='inline-end'>
            <Choice label='Region' value={region} options={['Global', 'United States', 'Europe', 'APAC']} onChange={setRegion} align='end'>
              <RegistryIcon lucide='GlobeIcon' className='size-3.5' aria-hidden='true' />
            </Choice>
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-share' className='sm:col-span-2' label='Visibility and copy'>
        <InputGroup>
          <InputGroupAddon>
            <RegistryIcon lucide='LinkIcon' className='size-4' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput id='ig-share' value={shareUrl} onChange={(event) => setShareUrl(event.target.value)} />
          <InputGroupAddon align='inline-end' className='gap-1'>
            <Choice label='Visibility' value={visibility} options={['Private', 'Team', 'Public']} onChange={setVisibility} align='end' />
            <InputGroupButton variant='ghost' size='icon-xs' aria-label={copiedText === shareUrl ? 'Link copied' : 'Copy link'} onClick={() => copy(shareUrl)}>
              <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <p role='status' className='text-xs text-text-muted sm:col-span-2'>{feedback}</p>
    </div>
  );
}
