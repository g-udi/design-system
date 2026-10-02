'use client';
import * as React from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { Slider as SliderPrimitive } from 'radix-ui';
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getValueText,
  ...props
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );
  return (
    <SliderPrimitive.Root
      data-slot='slider'
      defaultValue={defaultValue}
      value={value}
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
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot='slider-thumb'
          aria-label={
            props['aria-label']
              ? `${props['aria-label']}${_values.length > 1 ? ` ${index + 1}` : ''}`
              : `Value ${index + 1}`
          }
          aria-valuetext={getValueText ? getValueText((value ?? defaultValue ?? _values)[index], index) : undefined}
          key={index}
          className='ds-part-slider-thumb block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50'
        />
      ))}
    </SliderPrimitive.Root>
  );
}
export { Slider };
