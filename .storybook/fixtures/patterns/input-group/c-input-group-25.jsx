import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Kbd, KbdGroup } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

function Cell({ id, label, children, ...props }) {
  return (
    <Field {...props}>
      <FieldLabel htmlFor={id} className='text-xs font-normal text-text-muted'>{label}</FieldLabel>
      {children}
    </Field>
  );
}

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-lg gap-3 sm:grid-cols-2'>
      <Cell id='ig-shortcut' label='Keyboard shortcut'>
        <InputGroup>
          <InputGroupInput id='ig-shortcut' placeholder='Search documentation…' />
          <InputGroupAddon align='inline-end'>
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-multi-key' label='Icon and multi-key shortcut'>
        <InputGroup>
          <InputGroupAddon>
            <RegistryIcon lucide='SparklesIcon' className='text-success' />
          </InputGroupAddon>
          <InputGroupInput id='ig-multi-key' placeholder='Ask AI…' />
          <InputGroupAddon align='inline-end'>
            <KbdGroup>
              <Kbd>
                <RegistryIcon lucide='CommandIcon' className='size-3' />
              </Kbd>
              <Kbd>Enter</Kbd>
            </KbdGroup>
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-count' label='Result count'>
        <InputGroup>
          <InputGroupAddon>
            <RegistryIcon lucide='SearchIcon' />
          </InputGroupAddon>
          <InputGroupInput id='ig-count' defaultValue='timeout' />
          <InputGroupAddon align='inline-end'>
            <InputGroupText className='text-xs text-text-muted'>12 results</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-valid' label='Valid'>
        <InputGroup>
          <InputGroupInput id='ig-valid' defaultValue='gaudi_dev' />
          <InputGroupAddon align='inline-end'>
            <span className='flex size-4 items-center justify-center rounded-full bg-success'>
              <RegistryIcon lucide='CheckIcon' className='size-3 text-white' aria-hidden='true' />
            </span>
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-loading' label='Loading' data-disabled='true'>
        <InputGroup>
          <InputGroupInput id='ig-loading' defaultValue='checking_name' disabled />
          <InputGroupAddon align='inline-end'>
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
      </Cell>
      <Cell id='ig-disabled' label='Disabled' data-disabled='true'>
        <InputGroup>
          <InputGroupInput id='ig-disabled' placeholder='Not editable' disabled />
        </InputGroup>
      </Cell>
      <Cell id='ig-invalid' label='Invalid' data-invalid='true' className='sm:col-span-2'>
        <InputGroup>
          <InputGroupAddon>
            <RegistryIcon lucide='MailIcon' />
          </InputGroupAddon>
          <InputGroupInput id='ig-invalid' defaultValue='not-an-email' aria-invalid='true' />
        </InputGroup>
      </Cell>
    </div>
  );
}
