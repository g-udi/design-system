import {
  NativeSelect,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';
export function Pattern() {
  return (
    <NativeSelect aria-label='Produce' disabled className='w-full max-w-xs'>
      <NativeSelectOption value=''>Disabled Select</NativeSelectOption>
      <NativeSelectOption value='1'>Option 1</NativeSelectOption>
    </NativeSelect>
  );
}
