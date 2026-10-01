'use client';
import { cn } from '../../../../utilities/cn/index.js';

const ringSizes = { xs: 16, sm: 20, md: 28, lg: 40 };
const ringTones = {
  accent: 'text-accent',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  discovery: 'text-discovery',
  attention: 'text-attention',
  neutral: 'text-text-muted'
};

/**
 * A circular progress meter. It carries the same progressbar semantics as the bar, so give it a `label`
 * (or aria-labelledby). `showValue` prints the percentage in the centre at the md and lg sizes.
 */
function ProgressRing({
  value = 0,
  max = 100,
  size = 'sm',
  tone = 'accent',
  label = 'Progress',
  showValue = false,
  valueText,
  className,
  ...props
}) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current = Math.min(limit, Math.max(0, Number(value) || 0));
  const percent = Math.round((current / limit) * 100);
  const pixels = ringSizes[size] ?? ringSizes.sm;
  const stroke = pixels <= 20 ? 2.5 : 3;
  const radius = (pixels - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <span
      role='progressbar'
      aria-label={props['aria-labelledby'] ? undefined : label}
      aria-valuemin={0}
      aria-valuemax={limit}
      aria-valuenow={current}
      aria-valuetext={valueText ?? `${percent}%`}
      data-slot='progress-ring'
      data-tone={tone}
      className={cn('relative inline-grid shrink-0 place-items-center', ringTones[tone] ?? ringTones.accent, className)}
      style={{ width: pixels, height: pixels }}
      {...props}
    >
      <svg aria-hidden='true' width={pixels} height={pixels} viewBox={`0 0 ${pixels} ${pixels}`} className='-rotate-90'>
        <circle cx={pixels / 2} cy={pixels / 2} r={radius} fill='none' strokeWidth={stroke} className='stroke-border' />
        <circle
          cx={pixels / 2}
          cy={pixels / 2}
          r={radius}
          fill='none'
          stroke='currentColor'
          strokeWidth={stroke}
          strokeLinecap='round'
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - current / limit)}
          className='transition-[stroke-dashoffset] duration-300 motion-reduce:transition-none'
        />
      </svg>
      {showValue && pixels >= 28 ? (
        <span aria-hidden='true' className='text-text absolute text-xs font-medium tabular-nums'>
          {percent}
        </span>
      ) : null}
    </span>
  );
}

export { ProgressRing };
