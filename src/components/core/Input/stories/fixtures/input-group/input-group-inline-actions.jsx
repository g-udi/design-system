'use client';
import { useRef, useState } from 'react';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import {
  ButtonGroup,
  ButtonGroupText
} from '@gaudi/design-system/core/ButtonGroup';
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
import {
  PopoverPrimitive as Popover,
  PopoverContentPrimitive as PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTriggerPrimitive as PopoverTrigger
} from '@gaudi/design-system/core/Popover';
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '@gaudi/design-system/core/NumberField';

const shareUrl = 'https://gaudi.dev/share';

function Cell({ id, label, children }) {
  return (
    <Field>
      <FieldLabel htmlFor={id} className='text-xs font-normal text-text-muted'>{label}</FieldLabel>
      {children}
    </Field>
  );
}

export function Pattern() {
  const [query, setQuery] = useState('');
  const [fileName, setFileName] = useState('quarterly-report.pdf');
  const fileRef = useRef(null);
  const renameRequested = useRef(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const { copy, copiedText } = useCopyToClipboard({
    onCopy: () => setCopyFeedback('Copied to clipboard.'),
    onError: () => setCopyFeedback('Copy failed. Try again.')
  });
  return (
    <TooltipProvider>
      <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
        <Cell id='ig-button' label='Text button'>
          <InputGroup>
            <InputGroupInput id='ig-button' placeholder='Query…' value={query} onChange={(event) => setQuery(event.target.value)} />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton disabled={!query.trim()} onClick={() => setCopyFeedback(`Search requested for ${query.trim()} in this demo.`)}>Search</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Cell>
        <Cell id='ig-copy' label='Icon button'>
          <InputGroup>
            <InputGroupInput id='ig-copy' value={shareUrl} readOnly />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton aria-label={copiedText === shareUrl ? 'Link copied' : 'Copy'} variant='ghost' size='icon-xs' onClick={() => copy(shareUrl)}>
                <RegistryIcon lucide={copiedText === shareUrl ? 'CheckIcon' : 'CopyIcon'} className='size-4' />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Cell>
        <Cell id='ig-password' label='Visibility toggle'>
          <InputGroup>
            <InputGroupAddon>
              <RegistryIcon lucide='LockIcon' className='size-4' />
            </InputGroupAddon>
            <InputGroupInput id='ig-password' type={showPassword ? 'text' : 'password'} defaultValue='correct-horse' />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                variant='ghost'
                size='icon-xs'
                onClick={() => setShowPassword((current) => !current)}
              >
                <RegistryIcon lucide={showPassword ? 'EyeOffIcon' : 'EyeIcon'} className='size-4' />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Cell>
        <Cell id='ig-several' label='Several trailing actions'>
          <InputGroup>
            <InputGroupInput id='ig-several' placeholder='Component name…' value={name} onChange={(event) => setName(event.target.value)} />
            <InputGroupAddon align='inline-end'>
              <RegistryIcon lucide='StarIcon' className='size-4' />
              <InputGroupButton aria-label={copiedText === name ? 'Name copied' : 'Copy name'} size='icon-xs' variant='ghost' disabled={!name} onClick={() => copy(name)}>
                <RegistryIcon lucide={copiedText === name ? 'CheckIcon' : 'CopyIcon'} className='size-4' />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Cell>
        <Cell id='ig-tooltip' label='Tooltip'>
          <NumberField id='ig-tooltip' defaultValue={5000}>
            <NumberFieldGroup>
              <NumberFieldInput />
              <InputGroupAddon align='inline-end'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupButton aria-label='More information' variant='ghost' size='icon-xs'>
                      <RegistryIcon lucide='InfoIcon' />
                    </InputGroupButton>
                  </TooltipTrigger>
                  <TooltipContent>Monthly request limit</TooltipContent>
                </Tooltip>
              </InputGroupAddon>
            </NumberFieldGroup>
          </NumberField>
        </Cell>
        <Cell id='ig-popover' label='Popover'>
          <InputGroup className='gap-0'>
            <InputGroupAddon>
              <Popover>
                <PopoverTrigger asChild>
                  <InputGroupButton aria-label='Security information' variant='ghost' size='icon-xs' className='cursor-help'>
                    <RegistryIcon lucide='ShieldCheckIcon' className='text-success' />
                  </InputGroupButton>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-72'>
                  <PopoverHeader>
                    <PopoverTitle>Secure connection</PopoverTitle>
                    <PopoverDescription>Traffic to this site is encrypted end to end.</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
            </InputGroupAddon>
            <InputGroupInput id='ig-popover' defaultValue='https://gaudi.dev' className='pl-0.5!' readOnly />
          </InputGroup>
        </Cell>
        <Cell id='ig-menu' label='Menu'>
          <InputGroup>
            <InputGroupInput id='ig-menu' ref={fileRef} value={fileName} onChange={(event) => setFileName(event.target.value)} />
            <InputGroupAddon align='inline-end'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton aria-label='More actions' variant='ghost' size='icon-xs'>
                    <RegistryIcon lucide='MoreHorizontalIcon' className='size-4' />
                  </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' onCloseAutoFocus={(event) => { if (renameRequested.current) { event.preventDefault(); renameRequested.current = false; fileRef.current?.focus(); fileRef.current?.select(); } }}>
                  <DropdownMenuItem onSelect={() => { renameRequested.current = true; }}>Rename</DropdownMenuItem>
                  <DropdownMenuItem disabled={!fileName} onSelect={() => { setFileName((name) => `Copy of ${name}`); setCopyFeedback('File name duplicated in this demo.'); }}>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem disabled={!fileName} className='text-danger' onSelect={() => { setFileName(''); setCopyFeedback('File name cleared in this demo.'); }}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </InputGroupAddon>
          </InputGroup>
        </Cell>
        <Cell id='ig-button-group' label='Inside a button group'>
          <ButtonGroup>
            <ButtonGroupText>https://</ButtonGroupText>
            <InputGroup>
              <InputGroupInput id='ig-button-group' placeholder='example' />
              <InputGroupAddon align='inline-end'>
                <RegistryIcon lucide='InfoIcon' className='size-4' />
              </InputGroupAddon>
            </InputGroup>
            <ButtonGroupText>.com</ButtonGroupText>
          </ButtonGroup>
        </Cell>
        <p role='status' className='text-xs text-text-muted sm:col-span-2'>{copyFeedback}</p>
      </div>
    </TooltipProvider>
  );
}
