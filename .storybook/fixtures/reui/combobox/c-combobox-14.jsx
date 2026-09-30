// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
export function Pattern() {
  const anchor = useComboboxAnchor();
  return (
    <Field className='max-w-xs' data-invalid>
      <FieldLabel htmlFor='combobox-multiple-invalid'>Frameworks</FieldLabel>
      <Combobox
        multiple
        autoHighlight
        items={frameworks}
        defaultValue={[frameworks[0], frameworks[1]]}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values) => (
              <Fragment>
                {values.map((value) => (
                  <ComboboxChip key={value} showRemove={true}>
                    {value}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id='combobox-multiple-invalid'
                  placeholder='Select frameworks...'
                  aria-invalid
                />
              </Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError errors={[{ message: 'This field is required.' }]} />
    </Field>
  );
}
