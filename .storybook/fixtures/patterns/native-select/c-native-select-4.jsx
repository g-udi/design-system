import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';

// One shipping form covers every native select state: grouped options with a
// disabled entry, the small size, a disabled field and an invalid field.
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-lg gap-3 sm:grid-cols-2'>
      <Field>
        <FieldLabel htmlFor='native-select-country'>Country</FieldLabel>
        <NativeSelect id='native-select-country' className='w-full' defaultValue=''>
          <NativeSelectOption value=''>Select a country</NativeSelectOption>
          <NativeSelectOptGroup label='Europe'>
            <NativeSelectOption value='de'>Germany</NativeSelectOption>
            <NativeSelectOption value='fr'>France</NativeSelectOption>
            <NativeSelectOption value='uk'>United Kingdom</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label='Americas'>
            <NativeSelectOption value='us'>United States</NativeSelectOption>
            <NativeSelectOption value='ca'>Canada</NativeSelectOption>
            <NativeSelectOption value='br' disabled>
              Brazil (unavailable)
            </NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
        <FieldDescription>Grouped by region.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor='native-select-quantity'>Quantity</FieldLabel>
        <NativeSelect id='native-select-quantity' size='sm' className='w-full' defaultValue='1'>
          <NativeSelectOption value='1'>1 item</NativeSelectOption>
          <NativeSelectOption value='2'>2 items</NativeSelectOption>
          <NativeSelectOption value='5'>5 items</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>Small size.</FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor='native-select-carrier'>Carrier</FieldLabel>
        <NativeSelect id='native-select-carrier' disabled className='w-full' defaultValue='standard'>
          <NativeSelectOption value='standard'>Standard post</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>Only one carrier ships here.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor='native-select-speed'>Delivery speed</FieldLabel>
        <NativeSelect
          id='native-select-speed'
          aria-invalid='true'
          aria-describedby='native-select-speed-error'
          className='w-full'
          defaultValue=''
        >
          <NativeSelectOption value=''>Choose a speed</NativeSelectOption>
          <NativeSelectOption value='economy'>Economy</NativeSelectOption>
          <NativeSelectOption value='express'>Express</NativeSelectOption>
        </NativeSelect>
        <FieldError id='native-select-speed-error'>Choose a delivery speed.</FieldError>
      </Field>
    </div>
  );
}
