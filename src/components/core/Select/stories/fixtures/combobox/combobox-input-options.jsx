'use client';
import { useId, useState } from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '@gaudi/design-system/core/Select';
import {
  FieldRoot as Field,
  FieldErrorPrimitive as FieldError,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import { InputGroupAddon } from '@gaudi/design-system/core/Input';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];

function FrameworkCombobox({ label, error, inputProps, children, ...props }) {
  const id = useId();
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Combobox items={frameworks} {...props}>
        <ComboboxInput
          id={id}
          placeholder='Select a framework'
          aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${id}-error` : undefined}
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
      {error ? <FieldError id={`${id}-error`} errors={[{ message: error }]} /> : null}
    </Field>
  );
}

// A custom trigger icon that gives way to the clear button once a value is picked.
function CustomTriggerCombobox() {
  const [value, setValue] = useState(null);
  return (
    <FrameworkCombobox
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
      <FrameworkCombobox label='Framework' />
      <FrameworkCombobox label='Auto highlight' autoHighlight />
      <FrameworkCombobox
        label='Clear button'
        defaultValue={frameworks[0]}
        inputProps={{ showClear: true }}
      />
      <FrameworkCombobox label='Icon addon'>
        <InputGroupAddon>
          <RegistryIcon lucide='GlobeIcon' className='text-text-muted size-4' />
        </InputGroupAddon>
      </FrameworkCombobox>
      <CustomTriggerCombobox />
      <FrameworkCombobox
        label='Disabled'
        defaultValue={frameworks[1]}
        inputProps={{ disabled: true }}
      />
      <FrameworkCombobox
        label='Invalid'
        error='Pick a framework to continue.'
      />
    </div>
  );
}
