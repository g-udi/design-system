'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { cn } from '../../../utilities/cn/index.js';
import Button from '../Button/index.js';
import Input from '../Input/index.js';
import { NativeSelect, NativeSelectOption } from '../Select/NativeSelect.jsx';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '../NumberField/index.js';
import { Slider } from '../Slider/index.js';
import { ColorPickerArea } from './ColorPickerArea.jsx';
import { ColorPickerEyeDropper } from './ColorPickerEyeDropper.jsx';
import { hslToRgb, hsvToRgb, normalizeColor, normalizeHex, parseColor, rgbToHsl, rgbToHsv, toHex } from './colorPickerModel.js';

const formats = ['hex', 'rgb', 'hsl', 'css'];

function Channel({ label, suffix, value, max, disabled, readOnly, onChange }) {
  return (
    <NumberField value={value} min={0} max={max} step={1} disabled={disabled} readOnly={readOnly} onValueChange={next => { if (next !== null) onChange(next); }}>
      <NumberFieldGroup>
        <NumberFieldInput aria-label={label} className='px-1.5' />
        {suffix && <span aria-hidden='true' className='self-center pe-2 text-xs text-ui-muted-foreground'>{suffix}</span>}
      </NumberFieldGroup>
    </NumberField>
  );
}

export function ColorPicker({
  value,
  defaultValue = '#2563eb',
  onValueChange,
  defaultFormat = 'hex',
  showAlpha = true,
  showEyeDropper = true,
  label = 'Color',
  description,
  swatches = [],
  disabled = false,
  readOnly = false,
  name,
  id,
  className,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || `color-picker-${generatedId}`;
  const rootRef = useRef(null);
  const initialColor = useRef(normalizeColor(defaultValue) || '#2563eb');
  const [color, setColor] = useControllableState({
    value: value === undefined ? undefined : normalizeColor(value) || '#2563eb',
    defaultValue: initialColor.current,
    onChange: onValueChange
  });
  const rgba = parseColor(color);
  const [format, setFormat] = useState(formats.includes(defaultFormat) ? defaultFormat : 'hex');
  // Preserve hue through achromatic colors and exact pointer coordinates through RGB rounding.
  const [selection, setSelection] = useState(() => ({ base: color, ...rgbToHsv(rgba) }));
  const parsedHsv = rgbToHsv(rgba);
  const hsv = selection.base === color ? selection : { ...parsedHsv, h: parsedHsv.s ? parsedHsv.h : selection.h };
  if (selection.base !== color) setSelection({ ...hsv, base: color });
  const [draft, setDraft] = useState(null);
  if (draft && (draft.base !== color || draft.format !== format || disabled || readOnly)) setDraft(null);
  const activeDraft = !disabled && !readOnly && draft?.base === color && draft.format === format ? draft : null;
  const invalid = activeDraft?.submitted;
  const alpha = Math.round(rgba.a * 100);
  const displayValue = format === 'css' ? `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${Number(rgba.a.toFixed(3))})` : showAlpha ? color.slice(0, 7) : color;
  const text = activeDraft?.text ?? displayValue;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = `${inputId}-error`;
  const describedBy = [descriptionId, invalid && errorId].filter(Boolean).join(' ') || undefined;
  const presets = [...new Set(swatches.map(preset => normalizeColor(preset)).filter(Boolean))];
  const blocked = disabled || readOnly;

  useEffect(() => {
    const form = rootRef.current?.closest('form');
    const reset = event => {
      queueMicrotask(() => {
        if (event.defaultPrevented || !rootRef.current) return;
        setDraft(null);
        if (value === undefined) setColor(initialColor.current);
      });
    };
    form?.addEventListener('reset', reset);
    return () => form?.removeEventListener('reset', reset);
  }, [value, setColor]);

  const select = next => {
    if (blocked) return;
    setDraft(null);
    setColor(next);
  };
  const changeHsv = next => {
    if (blocked) return;
    const nextColor = toHex({ ...hsvToRgb(next), a: rgba.a });
    setSelection({ ...next, base: nextColor });
    select(nextColor);
  };
  const commit = () => {
    if (!activeDraft || blocked) return;
    const next = format === 'hex' ? normalizeHex(text) : normalizeColor(text);
    if (next) {
      // A six-digit hex edit changes RGB only when opacity has its own control.
      const explicitAlpha = [4, 8].includes(text.trim().replace(/^#/, '').length);
      select(format === 'hex' && showAlpha && !explicitAlpha ? toHex({ ...parseColor(next), a: rgba.a }) : next);
      setDraft(null);
    } else setDraft({ base: color, format, text, submitted: true });
  };
  const channels = format === 'hsl' ? rgbToHsl(rgba) : rgba;
  const channelNames = format === 'hsl' ? ['h', 's', 'l'] : ['r', 'g', 'b'];

  return (
    <div {...props} ref={rootRef} role='group' aria-labelledby={`${inputId}-label`} aria-disabled={disabled || undefined}
      data-slot='color-picker' data-disabled={disabled || undefined} data-readonly={readOnly || undefined}
      className={cn('ds-color-picker', className)}>
      <span id={`${inputId}-label`} className='text-sm font-medium'>{label}</span>
      <ColorPickerArea hsv={hsv} onChange={changeHsv} label={label} disabled={blocked} describedBy={descriptionId} />
      <div className='ds-color-picker-sliders' style={{ '--color-picker-rgb': `${rgba.r} ${rgba.g} ${rgba.b}` }}>
        <Slider className='ds-color-picker-hue' dir='ltr' min={0} max={360} step={1} value={[hsv.h]} disabled={blocked}
          aria-label={`${label}: hue`} getValueText={hue => `${Math.round(hue)} degrees`} onValueChange={([h]) => changeHsv({ ...hsv, h })} />
        {showAlpha && <Slider className='ds-color-picker-alpha' dir='ltr' value={[alpha]} disabled={blocked}
          aria-label={`${label}: opacity`} getValueText={opacity => `${opacity}%`} onValueChange={([a]) => select(toHex({ ...rgba, a: a / 100 }))} />}
      </div>
      <div className='ds-color-picker-controls' data-format={format} data-alpha={showAlpha} data-eyedropper={showEyeDropper}>
        {showEyeDropper && <ColorPickerEyeDropper label={label} color={color} disabled={blocked} onPick={next => select(toHex({ ...parseColor(next), a: rgba.a }))} />}
        <NativeSelect aria-label={`${label}: format`} value={format} disabled={disabled} onChange={event => { setDraft(null); setFormat(event.target.value); }}>
          {formats.map(option => <NativeSelectOption key={option} value={option}>{option.toUpperCase()}</NativeSelectOption>)}
        </NativeSelect>
        <div className='ds-color-picker-value'>
          {format === 'hex' || format === 'css' ? (
            <Input id={inputId} aria-label={`${label}: ${format} value`} aria-describedby={describedBy} aria-invalid={invalid || undefined}
              value={text} disabled={disabled} readOnly={readOnly} autoComplete='off' spellCheck={false} inputClassName='font-mono'
              onChange={event => setDraft({ base: color, format, text: event.target.value, submitted: false })} onBlur={commit}
              onKeyDown={event => {
                if (event.nativeEvent.isComposing) return;
                if (event.key === 'Enter') { event.preventDefault(); commit(); }
                else if (event.key === 'Escape' && activeDraft) { event.preventDefault(); event.stopPropagation(); setDraft(null); }
              }} />
          ) : (
            <div className='ds-color-picker-channels'>
              {channelNames.map(channel => (
                <Channel key={channel} label={`${label}: ${channel.toUpperCase()}`} suffix={channel.toUpperCase()}
                  value={channels[channel]} max={format === 'rgb' ? 255 : channel === 'h' ? 360 : 100} disabled={disabled} readOnly={readOnly}
                  onChange={next => select(toHex({ ...(format === 'hsl' ? hslToRgb({ ...channels, [channel]: next }) : { ...rgba, [channel]: next }), a: rgba.a }))} />
              ))}
            </div>
          )}
        </div>
        {showAlpha && <div className='ds-color-picker-opacity'>
          <Channel label={`${label}: opacity percent`} suffix='%' value={alpha} max={100} disabled={disabled} readOnly={readOnly}
            onChange={a => select(toHex({ ...rgba, a: a / 100 }))} />
        </div>}
      </div>
      {presets.length > 0 && (
        <div className='ds-color-picker-swatches' role='group' aria-label={`${label}: presets`}>
          {presets.map(preset => (
            <Button key={preset} data-slot='color-picker-swatch' variant='outline' size='icon' className='ds-color-picker-swatch'
              aria-label={`${label}: ${preset}`} aria-pressed={color === preset} title={preset} disabled={blocked}
              style={{ backgroundColor: preset }} onClick={() => select(preset)}>
              {color === preset && <RegistryIcon lucide='CheckIcon' aria-hidden='true' className='rounded-full bg-white text-black' />}
            </Button>
          ))}
        </div>
      )}
      {description && <p id={descriptionId} className='text-xs text-ui-muted-foreground'>{description}</p>}
      {invalid && <p id={errorId} role='alert' className='text-xs text-danger'>{format === 'hex' ? 'Enter a valid hex color, such as #2563eb or #2563eb80.' : 'Enter a hex, rgb(), rgba(), hsl(), or hsla() color.'}</p>}
      {name && <input type='hidden' name={name} value={color} disabled={disabled} />}
    </div>
  );
}
