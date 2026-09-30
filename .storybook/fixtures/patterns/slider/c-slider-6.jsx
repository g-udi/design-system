import { Slider } from '../../../../src/components/core/Slider/parts/slider.jsx';
export function Pattern() {
  return (
    <div className='flex w-full max-w-xs items-center justify-center px-2'>
      <Slider defaultValue={[25, 75]} max={100} step={5} />
    </div>
  );
}
