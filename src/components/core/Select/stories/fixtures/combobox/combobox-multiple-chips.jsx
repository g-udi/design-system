'use client';
import { Fragment, useId } from 'react';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from '@gaudi/design-system/core/Select';
import {
  FieldRoot as Field,
  FieldErrorPrimitive as FieldError,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];

function FrameworkChips({ label, removable = true, error, disabled, defaultValue, className }) {
  const id = useId();
  const anchor = useComboboxAnchor();
  return (
    <Field data-invalid={error ? true : undefined} className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Combobox multiple autoHighlight items={frameworks} defaultValue={defaultValue} disabled={disabled}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values) => (
              <Fragment>
                {values.map((value) => (
                  <ComboboxChip key={value} showRemove={removable}>
                    {value}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id={id}
                  placeholder='Add frameworks...'
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${id}-error` : undefined}
                />
              </Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
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

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xl gap-x-5 gap-y-6 sm:grid-flow-dense sm:grid-cols-2'>
      <FrameworkChips label='Removable chips' defaultValue={[frameworks[0]]} />
      <FrameworkChips
        label='Fixed chips'
        removable={false}
        defaultValue={[frameworks[0], frameworks[1]]}
      />
      <FrameworkChips
        label='Disabled'
        disabled
        defaultValue={[frameworks[0], frameworks[1]]}
      />
      <FrameworkChips
        label='Invalid'
        className='sm:col-span-2'
        defaultValue={[frameworks[3]]}
        error='Pick at least two frameworks.'
      />
    </div>
  );
}
