'use client';
import { useState } from 'react';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const maxLength = 140;

function Cell({ id, label, className, children }) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id} className='text-xs font-normal text-text-muted'>{label}</FieldLabel>
      {children}
    </Field>
  );
}

export function Pattern() {
  const [description, setDescription] = useState('');
  return (
    <div className='mx-auto grid w-full max-w-lg gap-3 sm:grid-cols-2'>
      <Cell id='ig-plain' label='Plain'>
        <InputGroup>
          <InputGroupInput id='ig-plain' placeholder='Search…' />
        </InputGroup>
      </Cell>
      <Cell id='ig-leading-icon' label='Leading icon'>
        <InputGroup>
          <InputGroupAddon>
            <RegistryIcon lucide='SearchIcon' />
          </InputGroupAddon>
          <InputGroupInput id='ig-leading-icon' placeholder='Search…' />
        </InputGroup>
      </Cell>
      <Cell id='ig-trailing-icon' label='Trailing icon'>
        <InputGroup>
          <InputGroupInput id='ig-trailing-icon' type='email' placeholder='you@example.com' />
          <InputGroupAddon align='inline-end'>
            <RegistryIcon lucide='MailIcon' />
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-both-icons' label='Icons on both sides'>
        <InputGroup>
          <InputGroupAddon>
            <RegistryIcon lucide='MicIcon' />
          </InputGroupAddon>
          <InputGroupInput id='ig-both-icons' placeholder='Listening…' />
          <InputGroupAddon align='inline-end'>
            <RegistryIcon lucide='RadioIcon' className='animate-pulse text-danger' />
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-leading-text' label='Leading text'>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id='ig-leading-text' placeholder='example.com' />
        </InputGroup>
      </Cell>
      <Cell id='ig-trailing-text' label='Trailing text'>
        <InputGroup>
          <InputGroupInput id='ig-trailing-text' placeholder='username' />
          <InputGroupAddon align='inline-end'>
            <InputGroupText>@gaudi.dev</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-both-text' label='Text on both sides'>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id='ig-both-text' type='number' placeholder='0.00' />
          <InputGroupAddon align='inline-end'>
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-divided' label='Divided addons'>
        <InputGroup>
          <InputGroupAddon className='pr-2'>
            <InputGroupText>€</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id='ig-divided' placeholder='0.00' className='border-x border-border' />
          <InputGroupAddon align='inline-end' className='pl-2'>
            <InputGroupText>EUR</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-block-start' label='Block-start header'>
        <InputGroup className='h-auto'>
          <InputGroupInput id='ig-block-start' placeholder='First name' />
          <InputGroupAddon align='block-start'>
            <InputGroupText className='font-medium'>User profile</InputGroupText>
            <RegistryIcon lucide='InfoIcon' className='ml-auto' />
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-block-end' label='Block-end footer'>
        <InputGroup>
          <InputGroupTextarea
            id='ig-block-end'
            placeholder='Description…'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={maxLength}
            className='min-h-12'
          />
          <InputGroupAddon align='block-end'>
            <InputGroupText className='text-xs tabular-nums text-text-muted'>
              {description.length}/{maxLength} characters
            </InputGroupText>
            <RegistryIcon lucide='InfoIcon' className='ml-auto text-text-muted' />
          </InputGroupAddon>
        </InputGroup>
      </Cell>
    </div>
  );
}
