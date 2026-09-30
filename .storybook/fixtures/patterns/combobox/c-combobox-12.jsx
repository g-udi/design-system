'use client';
import { Fragment } from 'react';
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
} from '../../../../src/components/core/Select/parts/combobox.jsx';
import {
  Field,
  FieldError,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];

function FrameworkChips({ id, label, removable = true, error, disabled, defaultValue }) {
  const anchor = useComboboxAnchor();
  return (
    <Field data-invalid={error ? true : undefined}>
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
      {error ? <FieldError errors={[{ message: error }]} /> : null}
    </Field>
  );
}

export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-xl gap-3 sm:grid-cols-2'>
      <FrameworkChips id='chips-removable' label='Removable chips' defaultValue={[frameworks[0]]} />
      <FrameworkChips
        id='chips-fixed'
        label='Fixed chips'
        removable={false}
        defaultValue={[frameworks[0], frameworks[1]]}
      />
      <FrameworkChips
        id='chips-disabled'
        label='Disabled'
        disabled
        defaultValue={[frameworks[0], frameworks[1]]}
      />
      <FrameworkChips
        id='chips-invalid'
        label='Invalid'
        defaultValue={[frameworks[3]]}
        error='Pick at least two frameworks.'
      />
    </div>
  );
}
