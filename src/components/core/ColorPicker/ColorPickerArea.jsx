'use client';

import { useRef } from 'react';
import { Slider } from '../Slider/index.js';
import { clamp, hsvToRgb } from './colorPickerModel.js';

/** The canvas is a two-axis input; its keyboard controls reuse Gaudi's sliders. */
export function ColorPickerArea({ hsv, onChange, label, disabled, describedBy }) {
  const pointer = useRef(null);
  if (disabled) pointer.current = null;
  const updatePointer = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    onChange({ ...hsv, s: clamp((event.clientX - rect.left) / rect.width), v: 1 - clamp((event.clientY - rect.top) / rect.height) });
  };
  const rgb = hsvToRgb(hsv);
  const endPointer = event => {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return (
    <div
      role='group'
      aria-label={`${label}: saturation and brightness`}
      aria-disabled={disabled || undefined}
      data-slot='color-picker-area'
      className='ds-color-picker-area'
      style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)` }}
      onPointerDown={event => {
        if (disabled || event.button !== 0 || !event.isPrimary) return;
        event.preventDefault();
        pointer.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.querySelector('[role="slider"]')?.focus({ preventScroll: true });
        updatePointer(event);
      }}
      onPointerMove={event => {
        if (!disabled && pointer.current === event.pointerId) updatePointer(event);
      }}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onLostPointerCapture={() => { pointer.current = null; }}
    >
      <span
        data-slot='color-picker-thumb'
        className='ds-color-picker-area-thumb'
        style={{ left: `clamp(0.5rem, ${hsv.s * 100}%, calc(100% - 0.5rem))`, top: `clamp(0.5rem, ${(1 - hsv.v) * 100}%, calc(100% - 0.5rem))`, backgroundColor: `rgb(${rgb.r} ${rgb.g} ${rgb.b})` }}
        aria-hidden='true'
      />
      <Slider className='sr-only' dir='ltr' disabled={disabled} aria-label={`${label}: saturation`} aria-describedby={describedBy}
        value={[Math.round(hsv.s * 100)]} onValueChange={([s]) => onChange({ ...hsv, s: s / 100 })} getValueText={value => `${value}%`} />
      <Slider className='sr-only' dir='ltr' disabled={disabled} aria-label={`${label}: brightness`} aria-describedby={describedBy}
        value={[Math.round(hsv.v * 100)]} onValueChange={([v]) => onChange({ ...hsv, v: v / 100 })} getValueText={value => `${value}%`} />
    </div>
  );
}
