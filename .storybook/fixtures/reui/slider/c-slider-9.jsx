// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
export function Pattern() {
  return (
    <div className='mx-auto grid w-full max-w-sm gap-4'>
      <Label className='text-sm font-medium'>Storage</Label>
      <Slider defaultValue={[15]} max={35} min={5} />
      <span
        aria-hidden='true'
        className='text-ui-muted-foreground flex w-full items-center justify-between text-xs font-medium'
      >
        <span>5 GB</span>
        <span>20 GB</span>
        <span>35 GB</span>
      </span>
    </div>
  );
}
