'use client';
import { useState } from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '../../../../src/components/core/Select/parts/combobox.jsx';
import {
  Field,
  FieldError,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { InputGroupAddon } from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];

function FrameworkCombobox({ id, label, error, inputProps, children, ...props }) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Combobox items={frameworks} {...props}>
        <ComboboxInput
          id={id}
          placeholder='Select a framework'
          aria-invalid={error ? true : undefined}
          {...inputProps}
        >
          {children}
        </ComboboxInput>
        <ComboboxContent>
          <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {error ? <FieldError errors={[{ message: error }]} /> : null}
    </Field>
  );
}

// A custom trigger icon that gives way to the clear button once a value is picked.
function CustomTriggerCombobox() {
  const [value, setValue] = useState(null);
  return (
    <FrameworkCombobox
      id='combobox-custom-trigger'
      label='Custom trigger icon'
      value={value}
      onValueChange={setValue}
      inputProps={{ showTrigger: false, showClear: true }}
    >
      {!value && (
        <ComboboxPrimitive.Trigger aria-label='Show options' data-slot='combobox-trigger'>
          <RegistryIcon lucide='ChevronsUpDownIcon' className='text-text-muted pointer-events-none size-4' />
        </ComboboxPrimitive.Trigger>
      )}
    </FrameworkCombobox>
  );
}

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-cols-2'>
      <FrameworkCombobox id='combobox-basic' label='Framework' />
      <FrameworkCombobox id='combobox-auto-highlight' label='Auto highlight' autoHighlight />
      <FrameworkCombobox
        id='combobox-clear'
        label='Clear button'
        defaultValue={frameworks[0]}
        inputProps={{ showClear: true }}
      />
      <FrameworkCombobox id='combobox-addon' label='Icon addon'>
        <InputGroupAddon>
          <RegistryIcon lucide='GlobeIcon' className='text-text-muted size-4' />
        </InputGroupAddon>
      </FrameworkCombobox>
      <CustomTriggerCombobox />
      <FrameworkCombobox
        id='combobox-disabled'
        label='Disabled'
        defaultValue={frameworks[1]}
        inputProps={{ disabled: true }}
      />
      <FrameworkCombobox
        id='combobox-invalid'
        label='Invalid'
        error='Pick a framework to continue.'
      />
    </div>
  );
}
