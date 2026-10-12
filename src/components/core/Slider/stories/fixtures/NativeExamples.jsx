import { useId, useState } from 'react';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { Slider } from '@gaudi/design-system/core/Slider';

export const priceLabel = 'Price range';
const clampTo = ({ min, max }, value) => Math.min(max, Math.max(min, value));
export const priceDefault = (args) => [clampTo(args, 20), clampTo(args, 80)];
export const formatPrice = ([low, high]) => `$${low} – $${high}`;

// One labelled slider with a live readout; the story owns the readout, the slider stays uncontrolled.
function SliderField({ label, icon, format, defaultValue, orientation, onValueChange, ...props }) {
  const [values, setValues] = useState(defaultValue);
  const hintId = useId();
  const vertical = orientation === 'vertical';
  return (
    <div className={vertical ? 'grid h-52 grid-rows-[auto_1fr] justify-items-center gap-3' : 'grid gap-3'}>
      <div className={vertical ? 'grid justify-items-center gap-0.5 text-sm' : 'flex items-center justify-between gap-3 text-sm'}>
        <span className='flex items-center gap-1.5 font-medium text-foreground'>
          <RegistryIcon lucide={icon} className='size-4 text-text-muted' />
          {label}
        </span>
        <output className='tabular-nums text-text-muted'>{format(values)}</output>
      </div>
      <Slider
        aria-label={label}
        aria-describedby={hintId}
        getValueText={(value) => String(value)}
        defaultValue={defaultValue}
        orientation={orientation}
        onValueChange={(next) => {
          setValues(next);
          onValueChange?.(next);
        }}
        {...props}
      />
      {/* The range and step are otherwise only felt while dragging; show them. */}
      <p id={hintId} className='text-xs tabular-nums text-text-muted'>{props.min}–{props.max} · steps of {props.step}</p>
    </div>
  );
}

export function PlaygroundDemo({ 'aria-label': label = 'Volume', defaultValue = [50], ...props } = {}) {
  const args = { min: 0, max: 100, step: 5, orientation: 'horizontal', ...props };
  return (
    <div className={args.orientation === 'vertical' ? 'flex justify-center gap-16' : 'grid gap-6'}>
      <SliderField {...args} label={label} icon='Volume2Icon' defaultValue={defaultValue} format={([value]) => value} key={`volume-${args.min}-${args.max}-${defaultValue.join(',')}`} />
      <SliderField {...args} label={priceLabel} icon='DollarSignIcon' defaultValue={priceDefault(args)} format={formatPrice} minStepsBetweenThumbs={1} key={`price-${args.min}-${args.max}`} />
    </div>
  );
}
