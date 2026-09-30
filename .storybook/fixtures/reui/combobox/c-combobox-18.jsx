// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
export function Pattern() {
  const [value, setValue] = useState(null);
  return (
    <Field className='max-w-xs'>
      <Combobox value={value} onValueChange={setValue} items={frameworks}>
        <ComboboxInput
          placeholder='Select framework'
          showTrigger={false}
          showClear={true}
        >
          {!value && (
            <ComboboxPrimitive.Trigger
              aria-label='Show options'
              data-slot='combobox-trigger'
            >
              <RegistryIcon
                lucide='ChevronsUpDownIcon'
                className='text-ui-muted-foreground pointer-events-none size-4'
              />
            </ComboboxPrimitive.Trigger>
          )}
        </ComboboxInput>
        <ComboboxContent>
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
    </Field>
  );
}
