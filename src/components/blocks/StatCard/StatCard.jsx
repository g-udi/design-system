import { cn } from '../../../utilities/cn';
import { CardAction, CardContent, CardFooter, CardHeader, CardRoot, CardTitle } from '../../core/Card';
import { Badge } from '../../core/Pill/parts/badge-extended.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

export const statTones = ['neutral', 'accent', 'info', 'success', 'warning', 'danger', 'discovery', 'attention'];

// Static class maps keep every tone visible to Tailwind.
const tileClass = {
  neutral: 'bg-surface-muted text-text',
  accent: 'bg-accent-subtle text-accent',
  info: 'bg-info-subtle text-info',
  success: 'bg-success-subtle text-success',
  warning: 'bg-warning-subtle text-warning',
  danger: 'bg-danger-subtle text-danger',
  discovery: 'bg-discovery-subtle text-discovery',
  attention: 'bg-attention-subtle text-attention'
};
const tintClass = {
  neutral: 'bg-surface-muted',
  accent: 'bg-accent-subtle border-accent/20',
  info: 'bg-info-subtle border-info-border',
  success: 'bg-success-subtle border-success-border',
  warning: 'bg-warning-subtle border-warning-border',
  danger: 'bg-danger-subtle border-danger-border',
  discovery: 'bg-discovery-subtle border-discovery-border',
  attention: 'bg-attention-subtle border-attention-border'
};
const segmentClass = {
  neutral: 'bg-text-muted',
  accent: 'bg-accent',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  discovery: 'bg-discovery',
  attention: 'bg-attention'
};

/** An icon on a tinted square, used for KPI and support metrics. */
export function StatIcon({ icon, tone = 'neutral', className }) {
  return (
    <span data-slot='stat-icon' className={cn('inline-flex size-8 shrink-0 items-center justify-center rounded-md [&_svg]:size-4', tileClass[tone], className)}>
      <RegistryIcon lucide={icon} aria-hidden='true' />
    </span>
  );
}

/**
 * A change badge. `value` keeps the host's formatting ("12.4%", "-3"); the direction
 * comes from `direction` or the sign. `invert` marks metrics where up is bad.
 */
export function StatDelta({ value, direction, invert = false, className }) {
  const text = String(value);
  const trend = direction || (/^\s*[-−]/.test(text) ? 'down' : /^\s*[+]?0(?:[.,]0+)?(?!\d)/.test(text) ? 'flat' : 'up');
  const good = trend === 'flat' ? null : (trend === 'up') !== invert;
  return (
    <Badge
      data-slot='stat-delta'
      data-trend={trend}
      size='sm'
      variant={good === null ? 'secondary' : good ? 'success-light' : 'destructive-light'}
      className={cn('gap-0.5 tabular-nums', className)}
    >
      <RegistryIcon lucide={trend === 'up' ? 'TrendingUpIcon' : trend === 'down' ? 'TrendingDownIcon' : 'MinusIcon'} aria-hidden='true' className='size-3' />
      <span className='sr-only'>{trend === 'up' ? 'Up' : trend === 'down' ? 'Down' : 'Unchanged'} </span>
      {text.replace(/^\s*[-−+]/, '')}
    </Badge>
  );
}

/**
 * A segmented bar with its legend. Segments are `{ label, value, tone }`; the bar is
 * decorative and the legend carries the numbers for every reader.
 */
export function StatMeter({ segments = [], label, showLegend = true, formatValue = (value) => value, className }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  return (
    <figure data-slot='stat-meter' className={cn('@container grid gap-2', className)}>
      {label ? <figcaption className='text-text-muted text-xs'>{label}</figcaption> : null}
      <div aria-hidden='true' className='bg-surface-muted flex h-2 gap-0.5 overflow-hidden rounded-full'>
        {segments.map((segment) => (
          <span key={segment.label} className={cn('h-full', segmentClass[segment.tone || 'neutral'])} style={{ width: `${(segment.value / total) * 100}%` }} />
        ))}
      </div>
      {showLegend ? (
        <dl className='grid gap-x-4 gap-y-1 text-xs @[20rem]:grid-cols-2'>
          {segments.map((segment) => (
            <div key={segment.label} className='flex items-center gap-2'>
              <span aria-hidden='true' className={cn('size-2 shrink-0 rounded-full', segmentClass[segment.tone || 'neutral'])} />
              <dt className='text-text-muted min-w-0 flex-1 truncate'>{segment.label}</dt>
              <dd className='font-medium tabular-nums'>
                {formatValue(segment.value)}
                <span className='text-text-muted ms-1 font-normal'>{Math.round((segment.value / total) * 100)}%</span>
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </figure>
  );
}

/**
 * A metric card on the Core Card: label, value and delta, with an optional icon tile,
 * action (usually a menu), description, footer and extra content such as a meter.
 * `variant` is `default`, `tinted` (a colour block in `tone`) or `inverse` (dark).
 */
export default function StatCard({ label, value, delta, invert, icon, tone = 'neutral', variant = 'default', action, description, footer, children, className }) {
  return (
    <CardRoot
      data-slot='stat-card'
      data-variant={variant}
      className={cn('gap-3 py-4', footer && 'pb-0', variant === 'tinted' && tintClass[tone], variant === 'inverse' && 'dark bg-surface text-text border-transparent', className)}
    >
      <CardHeader className='px-4'>
        <CardTitle className='text-text-muted flex items-center gap-2 text-sm font-normal'>
          {icon ? <StatIcon icon={icon} tone={tone} /> : null}
          {label}
        </CardTitle>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className='grid gap-2 px-4'>
        <div className='flex flex-wrap items-baseline gap-2'>
          <span data-slot='stat-value' className='text-2xl font-semibold tracking-tight tabular-nums'>{value}</span>
          {delta !== undefined && delta !== null ? <StatDelta value={delta} invert={invert} /> : null}
        </div>
        {description ? <p className='text-text-muted text-sm'>{description}</p> : null}
        {children}
      </CardContent>
      {footer ? <CardFooter className='text-text-muted border-t px-4 py-3 text-xs'>{footer}</CardFooter> : null}
    </CardRoot>
  );
}

export { StatCard };
