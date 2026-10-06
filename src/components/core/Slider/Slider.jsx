'use client';
import { useRef } from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { useMergedRefs } from '../../../hooks/state/use-merged-refs.js';
import { useResolvedDirection } from '../Direction/useResolvedDirection.js';
import { cn } from '../../../utilities/cn/index.js';
import { Slider as SliderPrimitive } from 'radix-ui';
// Thumbs without `aria-label`/`aria-labelledby` fall back to this name; pass `thumbLabel` to translate it.
const defaultThumbLabel = (index) => `Value ${index + 1}`;
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getValueText,
  onValueChange,
  dir,
  ref,
  thumbLabel = defaultThumbLabel,
  ...props
}) {
  const rootRef = useRef(null);
  const mergedRef = useMergedRefs(ref, rootRef);
  // An explicit `dir` wins; otherwise the nearest ancestor/document `dir`, then DirectionProvider.
  const resolvedDir = useResolvedDirection(dir, rootRef);
  const [values, setValues] = useControllableState({
    value,
    defaultValue: defaultValue ?? [min],
    onChange: onValueChange
  });
  return (
    <SliderPrimitive.Root
      ref={mergedRef}
      data-slot='slider'
      dir={resolvedDir}
      value={values}
      onValueChange={setValues}
      min={min}
      max={max}
      className={cn(
        'ds-part-slider relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot='slider-track'
        className='ds-part-slider-track relative grow overflow-hidden data-horizontal:w-full data-vertical:h-full'
      >
        <SliderPrimitive.Range
          data-slot='slider-range'
          className='ds-part-slider-range absolute select-none data-horizontal:h-full data-vertical:w-full'
        />
      </SliderPrimitive.Track>
      {Array.from({ length: values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot='slider-thumb'
          aria-label={
            props['aria-labelledby'] ? undefined : props['aria-label']
              ? `${props['aria-label']}${values.length > 1 ? ` ${index + 1}` : ''}`
              : typeof thumbLabel === 'function' ? thumbLabel(index, values.length) : thumbLabel
          }
          aria-labelledby={props['aria-labelledby']}
          aria-describedby={props['aria-describedby']}
          aria-valuetext={getValueText ? getValueText(values[index], index) : undefined}
          key={index}
          className='ds-part-slider-thumb block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50'
        />
      ))}
    </SliderPrimitive.Root>
  );
}
export { Slider };
