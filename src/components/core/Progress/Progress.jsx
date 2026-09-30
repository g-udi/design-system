import { useId } from 'react';
import { cn } from '../../../utilities/cn';

export function normalizeProgress(value, max = 100) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  return {
    max: limit,
    value: Number.isFinite(value)
      ? Math.min(limit, Math.max(0, value))
      : undefined
  };
}
export default function Progress({
  label,
  value,
  max = 100,
  valueText,
  tone = 'accent',
  className
}) {
  const id = useId();
  const progress = normalizeProgress(value, max);
  return (
    <div className={cn('ds-progress', className)} data-tone={tone}>
      <div className='ds-progress-label'>
        <label htmlFor={id}>{label}</label>
        {valueText && <span>{valueText}</span>}
      </div>
      <progress
        id={id}
        max={progress.max}
        value={progress.value}
        aria-valuetext={valueText}
      />
    </div>
  );
}
