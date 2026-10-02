'use client';
import { useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../../core/Popover/parts/popover.jsx';
import { Progress } from '../../../core/Progress/parts/progress.jsx';
import { ProgressRing } from '../../../core/Progress/parts/progress-ring.jsx';
import { estimateChatCost, formatTokenCount } from './chat-models.js';

const DEFAULT_LABELS = {
  trigger: 'Context',
  title: 'Context window',
  input: 'Input',
  cachedInput: 'Cached input',
  output: 'Output',
  reasoning: 'Reasoning',
  cost: 'Estimated cost',
  of: 'of',
  tokens: 'tokens',
  warning: 'Getting full. Older turns may be summarized soon.',
  danger: 'Almost full. Start a new chat or trim attachments.'
};

const BAR_TONES = {
  accent: '[&_[data-slot=progress-indicator]]:bg-accent',
  warning: '[&_[data-slot=progress-indicator]]:bg-warning',
  danger: '[&_[data-slot=progress-indicator]]:bg-danger'
};
const TEXT_TONES = { accent: 'text-text-muted', warning: 'text-ui-warning-ink', danger: 'text-ui-danger-ink' };

// Amounts under a cent read as "<$0.01" rather than a row of decimals.
const formatCost = (amount, currency) => {
  const format = new Intl.NumberFormat('en', { style: 'currency', currency });
  return amount > 0 && amount < 0.01 ? `<${format.format(0.01)}` : format.format(amount);
};

/**
 * How much of the model's context window a chat uses, for the composer toolbar beside ChatModelSelect.
 * The trigger is a small ring with the percentage; pressing it opens the breakdown: tokens used of the
 * window, input, cached input, output and reasoning tokens, and an estimated cost. `usage` follows the
 * AI SDK shape `{ inputTokens, outputTokens, reasoningTokens, cachedInputTokens }` (cached input is the
 * part of input read from cache). `maxTokens` and `pricing` (dollars per million tokens) default to the
 * `model`'s `contextWindow` and `pricing`, so a `chatModels` entry is enough; `usedTokens` defaults to
 * input + output + reasoning, and `cost` overrides the estimate. The tone turns warning at `warnAt` and
 * danger at `dangerAt` (fractions of the window). `showValue={false}` keeps the trigger to the ring.
 */
function ChatContextMeter({
  usage = {},
  usedTokens,
  maxTokens,
  model,
  pricing,
  cost,
  currency = 'USD',
  warnAt = 0.75,
  dangerAt = 0.9,
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
  const { inputTokens = 0, outputTokens = 0, reasoningTokens = 0, cachedInputTokens = 0 } = usage;
  const used = usedTokens ?? inputTokens + outputTokens + reasoningTokens;
  const limit = maxTokens ?? model?.contextWindow ?? 0;
  const ratio = limit > 0 ? Math.min(1, used / limit) : 0;
  const percent = Math.round(ratio * 1000) / 10;
  const tone = ratio >= dangerAt ? 'danger' : ratio >= warnAt ? 'warning' : 'accent';
  const estimate = estimateChatCost(usage, pricing ?? model?.pricing);
  const total = cost ?? estimate?.total;
  const percentText = `${percent % 1 ? percent.toFixed(1) : percent}%`;
  const summary = limit ? `${formatTokenCount(used)} ${labels.of} ${formatTokenCount(limit)} ${labels.tokens}` : `${formatTokenCount(used)} ${labels.tokens}`;
  const rows = [
    { key: 'input', label: labels.input, tokens: inputTokens - Math.min(cachedInputTokens, inputTokens), cost: estimate?.input },
    { key: 'cachedInput', label: labels.cachedInput, tokens: cachedInputTokens, cost: estimate?.cachedInput },
    { key: 'output', label: labels.output, tokens: outputTokens, cost: estimate?.output },
    { key: 'reasoning', label: labels.reasoning, tokens: reasoningTokens, cost: estimate?.reasoning }
  ].filter((row) => row.tokens > 0 || row.key === 'input' || row.key === 'output');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size='xs'
          variant='ghost'
          data-slot='chat-context-meter'
          data-tone={tone}
          aria-label={`${labels.trigger}: ${percentText} used, ${summary}`}
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
          <span className='text-text-muted text-xs tabular-nums'>{summary}{model?.label ? ` · ${model.label}` : ''}</span>
          {tone !== 'accent' ? <p className={cn('text-xs', TEXT_TONES[tone])}>{labels[tone]}</p> : null}
        </div>
        <dl className='grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-3 gap-y-1 border-t pt-3 text-xs'>
          {rows.map((row) => (
            <div key={row.key} className='contents'>
              <dt className='text-text-muted'>{row.label}</dt>
              <dd className='text-end tabular-nums'>{formatTokenCount(row.tokens)}</dd>
              <dd className='text-text-muted text-end tabular-nums'>{estimate ? formatCost(row.cost, currency) : ''}</dd>
            </div>
          ))}
        </dl>
        {total != null ? (
          <div className='flex items-baseline justify-between gap-3 border-t pt-3 text-sm'>
            <span className='text-text-muted'>{labels.cost}</span>
            <span className='font-medium tabular-nums'>{formatCost(total, currency)}</span>
          </div>
        ) : null}
        {children}
      </PopoverContent>
    </Popover>
  );
}

export { ChatContextMeter };
