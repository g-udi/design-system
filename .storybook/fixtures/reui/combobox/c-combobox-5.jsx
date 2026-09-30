// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '../../../../src/components/core/Select/parts/combobox.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Combobox items={frameworks} autoHighlight>
        <ComboboxInput placeholder='Select a framework' />
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
