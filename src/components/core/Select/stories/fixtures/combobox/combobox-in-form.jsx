'use client';
import { useId } from 'react';
import ToastProvider, { toast } from '@gaudi/design-system/core/Toast';
import { default as Button } from '@gaudi/design-system/core/Button';
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
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
export function Pattern() {
  const toastId = useId();
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const framework = formData.get('framework');
    toast(`You selected ${framework} as your framework.`, { toasterId: toastId });
  };
  return (
    <>
      <ToastProvider id={toastId} />
    <form
      id={`${toastId}-form-with-combobox`}
      onSubmit={handleSubmit}
      className='w-full max-w-xs space-y-4'
    >
      <Field>
        <FieldLabel htmlFor={`${toastId}-framework`}>Framework</FieldLabel>
        <Combobox items={frameworks}>
          <ComboboxInput
            id={`${toastId}-framework`}
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
      <Button type='submit' form={`${toastId}-form-with-combobox`} className='w-full'>
        Submit
      </Button>
    </form>
    </>
  );
}
