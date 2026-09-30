// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
export function Pattern() {
  return (
    <div className='flex w-full max-w-xs items-center justify-center'>
      <Slider defaultValue={[50]} max={100} step={1} disabled />
    </div>
  );
}
