// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  NativeSelect,
  NativeSelectOption
} from '../../../../src/components/core/Select/parts/native-select.jsx';
export function Pattern() {
  return (
    <NativeSelect aria-label='Produce' className='w-full max-w-xs'>
      <NativeSelectOption value=''>Select a fruit</NativeSelectOption>
      <NativeSelectOption value='apple'>Apple</NativeSelectOption>
      <NativeSelectOption value='banana'>Banana</NativeSelectOption>
      <NativeSelectOption value='blueberry'>Blueberry</NativeSelectOption>
      <NativeSelectOption value='grapes' disabled>
        Grapes
      </NativeSelectOption>
      <NativeSelectOption value='pineapple'>Pineapple</NativeSelectOption>
    </NativeSelect>
  );
}
