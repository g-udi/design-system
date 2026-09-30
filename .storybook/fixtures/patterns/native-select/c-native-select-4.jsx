import {
  Field,
  FieldDescription,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  NativeSelect,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <FieldLabel htmlFor='native-select-country'>Country</FieldLabel>
      <NativeSelect id='native-select-country'>
        <NativeSelectOption value=''>Select a country</NativeSelectOption>
        <NativeSelectOption value='us'>United States</NativeSelectOption>
        <NativeSelectOption value='uk'>United Kingdom</NativeSelectOption>
        <NativeSelectOption value='ca'>Canada</NativeSelectOption>
      </NativeSelect>
      <FieldDescription>Select your country of residence.</FieldDescription>
    </Field>
  );
}
