import { useId, useState } from 'react';
import Input from '../../../components/core/Input';
import { Slider } from '../../../components/core/Slider';
import { formatHex, formatOklch, parseColor, toOklch } from '../../../themes/color.js';

const CHANNELS = [
  { key: 'l', label: 'Lightness', min: 0, max: 1, step: 0.005, format: (value) => `${Math.round(value * 1000) / 10}%` },
  { key: 'c', label: 'Chroma', min: 0, max: 0.37, step: 0.002, format: (value) => value.toFixed(3) },
  { key: 'h', label: 'Hue', min: 0, max: 360, step: 1, format: (value) => `${Math.round(value)}°` }
];

/** OKLCH sliders plus a hex/CSS colour input for one token. */
export function OklchField({ label, value, onChange }) {
  const id = useId();
  const lch = toOklch(value) || { l: 0.5, c: 0, h: 0 };
  const [draft, setDraft] = useState(null);
  const commit = () => {
    if (draft != null && parseColor(draft)) onChange(draft.trim());
    setDraft(null);
  };
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-3'>
        <span aria-hidden='true' className='size-10 shrink-0 rounded border border-border' style={ { background: value } } />
        <div className='min-w-0 grow'>
          <label htmlFor={ `${id}-hex` } className='block text-sm font-medium text-text'>{label}</label>
          <Input
            id={ `${id}-hex` }
            className='mt-1'
            value={ draft ?? formatHex(value) ?? value }
            invalid={ draft != null && !parseColor(draft) }
            onChange={ (event) => setDraft(event.target.value) }
            onBlur={ commit }
            onKeyDown={ (event) => { if (event.key === 'Enter') commit(); } }
            aria-describedby={ `${id}-css` }
          />
        </div>
      </div>
      <p id={ `${id}-css` } className='break-all font-mono text-xs text-text-muted'>{value}</p>
      {CHANNELS.map((channel) => (
        <div key={ channel.key } className='grid grid-cols-[5.5rem_1fr_3.5rem] items-center gap-3 text-sm'>
          <span id={ `${id}-${channel.key}` } className='text-text-muted'>{channel.label}</span>
          <Slider
            aria-labelledby={ `${id}-${channel.key}` }
            min={ channel.min }
            max={ channel.max }
            step={ channel.step }
            value={ [ lch[channel.key] ] }
            getValueText={ channel.format }
            onValueChange={ ([ next ]) => onChange(formatOklch({ ...lch, [channel.key]: next })) }
          />
          <span className='text-end font-mono text-xs text-text-muted'>{channel.format(lch[channel.key])}</span>
        </div>
      ))}
    </div>
  );
}
