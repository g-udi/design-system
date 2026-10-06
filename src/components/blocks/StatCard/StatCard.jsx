import { cn } from '../../../utilities/cn';
import { CardAction, CardContent, CardFooter, CardHeader, CardRoot, CardTitle } from '../../core/Card';
import { Badge } from '../../core/Pill/Badge.jsx';
import { IconTile } from '../../core/Icon/IconTile.jsx';
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
    <IconTile data-slot='stat-icon' size='sm' variant='solid' className={cn(tileClass[tone], className)}>
      <RegistryIcon lucide={icon} aria-hidden='true' />
    </IconTile>
  );
}

/**
 * A change badge. The host supplies the formatted `value`, optional `direction`, and semantic
 * `tone`. Direction and whether a change is favorable are never inferred from the value.
 */
export function StatDelta({ value, direction, tone = 'neutral', className }) {
  const trend = { up: ['TrendingUpIcon', 'Up'], down: ['TrendingDownIcon', 'Down'], flat: ['MinusIcon', 'Unchanged'] }[direction];
  const variant = { neutral: 'secondary', accent: 'info-light', info: 'info-light', success: 'success-light', warning: 'warning-light', danger: 'destructive-light', discovery: 'discovery-light', attention: 'warning-light' }[tone] || 'secondary';
  return (
    <Badge
      data-slot='stat-delta'
      data-trend={trend ? direction : undefined}
      size='sm'
      variant={variant}
      className={cn('gap-0.5 tabular-nums', className)}
    >
      {trend ? <RegistryIcon lucide={trend[0]} aria-hidden='true' className='size-3' /> : null}
      {trend ? <span className='sr-only'>{trend[1]} </span> : null}
      {value}
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
      <dl className={cn('grid gap-x-4 gap-y-1 text-xs @[20rem]:grid-cols-2', !showLegend && 'sr-only')}>
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
    </figure>
  );
}

/**
 * A metric card on the Core Card: label, value and delta, with an optional icon tile,
 * action (usually a menu), description, footer and extra content such as a meter.
 * `variant` is `default`, `tinted` (a colour block in `tone`) or `inverse` (dark).
 */
export default function StatCard({ label, value, delta, deltaDirection, deltaTone = 'neutral', icon, tone = 'neutral', variant = 'default', action, description, footer, children, className }) {
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
      <CardContent className='grid grid-cols-1 gap-2 px-4'>
        <div className='flex flex-wrap items-baseline gap-2'>
          <span data-slot='stat-value' className='text-2xl font-semibold tracking-tight tabular-nums'>{value}</span>
          {delta !== undefined && delta !== null ? <StatDelta value={delta} direction={deltaDirection} tone={deltaTone} /> : null}
        </div>
        {description ? <p className='text-text-muted text-sm'>{description}</p> : null}
        {children}
      </CardContent>
      {footer ? <CardFooter className='text-text-muted border-t px-4 py-3 text-xs'>{footer}</CardFooter> : null}
    </CardRoot>
  );
}

export { StatCard };
