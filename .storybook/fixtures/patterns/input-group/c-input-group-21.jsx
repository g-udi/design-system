'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  ButtonGroup,
  ButtonGroupText
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const copied = () => toast.success('Copied to clipboard');

function Cell({ id, label, children }) {
  return (
    <Field>
      <FieldLabel htmlFor={id} className='text-xs font-normal text-text-muted'>{label}</FieldLabel>
      {children}
    </Field>
  );
}

export function Pattern() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <TooltipProvider>
      <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
        <Cell id='ig-button' label='Text button'>
          <InputGroup>
            <InputGroupInput id='ig-button' placeholder='Query…' />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton>Search</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Cell>
        <Cell id='ig-copy' label='Icon button'>
          <InputGroup>
            <InputGroupInput id='ig-copy' defaultValue='https://gaudi.dev/share' readOnly />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton aria-label='Copy' variant='ghost' size='icon-xs' onClick={copied}>
                <RegistryIcon lucide='CopyIcon' className='size-4' />
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
            <InputGroupInput id='ig-several' placeholder='Component name…' />
            <InputGroupAddon align='inline-end'>
              <RegistryIcon lucide='StarIcon' className='size-4' />
              <InputGroupButton aria-label='Copy name' size='icon-xs' variant='ghost' onClick={copied}>
                <RegistryIcon lucide='CopyIcon' className='size-4' />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Cell>
        <Cell id='ig-tooltip' label='Tooltip'>
          <InputGroup>
            <InputGroupInput id='ig-tooltip' type='number' defaultValue='5000' />
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
          </InputGroup>
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
            <InputGroupInput id='ig-menu' defaultValue='quarterly-report.pdf' />
            <InputGroupAddon align='inline-end'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton aria-label='More actions' variant='ghost' size='icon-xs'>
                    <RegistryIcon lucide='MoreHorizontalIcon' className='size-4' />
                  </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className='text-danger'>Delete</DropdownMenuItem>
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
      </div>
    </TooltipProvider>
  );
}
