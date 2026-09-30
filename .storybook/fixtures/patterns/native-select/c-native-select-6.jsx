import {
  NativeSelect,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';
export function Pattern() {
  return (
    <NativeSelect
      aria-label='Produce'
      aria-invalid='true'
      className='w-full max-w-xs'
    >
      <NativeSelectOption value=''>Invalid Select</NativeSelectOption>
      <NativeSelectOption value='1'>Option 1</NativeSelectOption>
    </NativeSelect>
  );
}
