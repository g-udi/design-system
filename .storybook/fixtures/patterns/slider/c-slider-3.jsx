import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
export function Pattern() {
  return (
    <div className='flex w-full max-w-xs items-center justify-center'>
      <Slider defaultValue={[10, 40, 80]} max={100} step={10} />
    </div>
  );
}
