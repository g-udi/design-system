'use client';
import { useState } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import Button from '../../core/Button/index.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../core/Popover/PopoverPrimitives.jsx';
import { Progress } from '../../core/Progress/ProgressPrimitives.jsx';
import { ProgressRing } from '../../core/Progress/ProgressRing.jsx';
import { formatTokenCount } from './chatContextModel.js';

const DEFAULT_LABELS = { trigger: 'Context', title: 'Context window', of: 'of', tokens: 'tokens', used: 'used' };
const BAR_TONES = {
  accent: '[&_[data-slot=progress-indicator]]:bg-accent',
  warning: '[&_[data-slot=progress-indicator]]:bg-warning',
  danger: '[&_[data-slot=progress-indicator]]:bg-danger'
};
const TEXT_TONES = { accent: 'text-text-muted', warning: 'text-ui-warning-ink', danger: 'text-ui-danger-ink' };
const percentLabel = (value) => `${value}%`;

/** Context presentation only. The host prepares totals, breakdown values, cost text and status. */
function ChatContextMeter({
  usedTokens = 0,
  maxTokens = 0,
  modelLabel,
  breakdown = [],
  cost,
  costLabel = 'Cost',
  tone = 'accent',
  message,
  formatTokens = formatTokenCount,
  formatPercentage = percentLabel,
  showValue = true,
  align = 'end',
  side,
  labels: labelOverrides,
  className,
  contentClassName,
  children
}) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const [open, setOpen] = useState(false);
  const ratio = maxTokens > 0 ? Math.max(0, Math.min(1, usedTokens / maxTokens)) : 0;
  const percent = Math.round(ratio * 1000) / 10;
  const percentText = formatPercentage(percent);
  const summary = maxTokens > 0 ? `${formatTokens(usedTokens)} ${labels.of} ${formatTokens(maxTokens)} ${labels.tokens}` : `${formatTokens(usedTokens)} ${labels.tokens}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size='xs'
          variant='ghost'
          data-slot='chat-context-meter'
          data-tone={tone}
          aria-label={`${labels.trigger}: ${percentText} ${labels.used}, ${summary}`}
          className={cn('ds-part-chat-context-meter gap-1.5 tabular-nums', TEXT_TONES[tone], className)}
        >
          <ProgressRing value={ratio * 100} size='xs' tone={tone} label={labels.trigger} aria-hidden='true' role={undefined} />
          {showValue ? <span className='hidden sm:inline'>{percentText}</span> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        collisionPadding={8}
        aria-label={labels.title}
        className={cn('w-[min(18rem,calc(100vw-1rem))] gap-3', contentClassName)}
      >
        <div className='grid gap-2'>
          <div className='flex items-baseline justify-between gap-3'>
            <span className='font-medium'>{labels.title}</span>
            <span className={cn('tabular-nums', TEXT_TONES[tone] === 'text-text-muted' ? 'text-text' : TEXT_TONES[tone])}>{percentText}</span>
          </div>
          <Progress value={ratio * 100} aria-label={labels.title} aria-valuetext={`${percentText}, ${summary}`} className={cn('h-1.5', BAR_TONES[tone])} />
          <span className='text-text-muted text-xs tabular-nums'>{summary}{modelLabel != null ? <> · {modelLabel}</> : null}</span>
          {message != null ? <p className={cn('text-xs', TEXT_TONES[tone])}>{message}</p> : null}
        </div>
        {breakdown.length ? (
          <dl className='grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-3 gap-y-1 border-t pt-3 text-xs'>
            {breakdown.map((row) => (
              <div key={row.id} className='contents'>
                <dt className='text-text-muted break-words'>{row.label}</dt>
                <dd className='text-end tabular-nums'>{row.value}</dd>
                <dd className='text-text-muted text-end tabular-nums'>{row.detail}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {cost != null ? (
          <div className='flex items-baseline justify-between gap-3 border-t pt-3 text-sm'>
            <span className='text-text-muted'>{costLabel}</span>
            <span className='font-medium tabular-nums'>{cost}</span>
          </div>
        ) : null}
        {children}
      </PopoverContent>
    </Popover>
  );
}

export { ChatContextMeter };
