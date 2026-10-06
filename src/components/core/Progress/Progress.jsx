import { useId } from 'react';
import { cn } from '../../../utilities/cn';
import { Progress as ProgressRoot } from './ProgressPrimitives.jsx';

export function normalizeProgress(value, max = 100) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  return {
    max: limit,
    value: Number.isFinite(value)
      ? Math.min(limit, Math.max(0, value))
      : undefined
  };
}

const toneClasses = {
  accent: '',
  success: '*:data-[slot=progress-indicator]:bg-success',
  warning: '*:data-[slot=progress-indicator]:bg-warning',
  danger: '*:data-[slot=progress-indicator]:bg-danger'
};

/** A labelled progress bar for one task, built on the Progress part. Omit `value` for indeterminate work. */
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
    <div className={ cn('grid gap-2', className) } data-tone={ tone }>
      <div className='flex justify-between gap-4 text-sm text-text-muted'>
        <span id={ id }>{label}</span>
        {valueText && <span className='tabular-nums'>{valueText}</span>}
      </div>
      <ProgressRoot
        value={ progress.value ?? null }
        max={ progress.max }
        aria-label={ undefined }
        aria-labelledby={ id }
        getValueLabel={ valueText ? () => valueText : undefined }
        className={ cn('h-2', toneClasses[tone]) }
      />
    </div>
  );
}
