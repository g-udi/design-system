// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea
} from '../../../../src/components/core/NumberField/parts/number-field-extended.jsx';
export function Pattern() {
  return (
    <div className='w-full max-w-48'>
      <NumberField defaultValue={5} min={0} max={100} size='sm'>
        <NumberFieldScrubArea label='Small' />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}
