'use client';
import { toast } from 'sonner';
import { default as Button } from '../../../../src/components/core/Button/index.js';
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
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
export function Pattern() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const framework = formData.get('framework');
    toast(`You selected ${framework} as your framework.`);
  };
  return (
    <form
      id='form-with-combobox'
      onSubmit={handleSubmit}
      className='w-full max-w-xs space-y-4'
    >
      <Field>
        <FieldLabel htmlFor='framework'>Framework</FieldLabel>
        <Combobox items={frameworks}>
          <ComboboxInput
            id='framework'
            name='framework'
            placeholder='Select a framework'
            required
          />
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
      <Button type='submit' form='form-with-combobox' className='w-full'>
        Submit
      </Button>
    </form>
  );
}
