'use client';
import { useId, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { Slider } from '../../../core/Slider/parts/slider.jsx';

const DEFAULT_LEVELS = [
  { value: 'low', label: 'Low', description: 'Quick answers for small edits' },
  { value: 'medium', label: 'Medium', description: 'Balanced for most writing and research' },
  { value: 'high', label: 'High', description: 'Thinks longer before it answers' },
  { value: 'max', label: 'Max', description: 'Deep work; slower and uses more of your plan' }
];

/**
 * How hard the assistant should think: a stepped slider over named levels. `levels` are
 * `{ value, label, description? }`; `value` / `defaultValue` / `onValueChange(value, level)` follow the
 * level's `value`. The thumb announces the level name (not a number), and the description of the
 * chosen level reads below it. `compact` drops the description and the step labels for a toolbar.
 */
function ChatEffortSlider({
  levels = DEFAULT_LEVELS,
  value: valueProp,
  defaultValue,
  onValueChange,
  label = 'Effort',
  compact = false,
  disabled = false,
  className,
  ...props
}) {
  const fallback = defaultValue ?? levels[Math.min(1, levels.length - 1)]?.value;
  const [internal, setInternal] = useState(fallback);
  const value = valueProp === undefined ? internal : valueProp;
  const index = Math.max(0, levels.findIndex((level) => level.value === value));
  const level = levels[index];
  const descriptionId = useId();
  const choose = (nextIndex) => {
    const next = levels[nextIndex];
    if (!next || next.value === value) return;
    setInternal(next.value);
    onValueChange?.(next.value, next);
  };
  return (
    <div
      data-slot='chat-effort-slider'
      data-compact={compact || undefined}
      className={cn('ds-part-chat-effort-slider grid gap-2', compact ? 'w-40' : 'w-full max-w-sm', className)}
      {...props}
    >
      <div className='flex items-baseline justify-between gap-3 text-sm'>
        <span aria-hidden='true' className='font-medium'>{label}</span>
        <span className='text-text-muted tabular-nums'>{level?.label}</span>
      </div>
      <Slider
        aria-label={label}
        min={0}
        max={Math.max(0, levels.length - 1)}
        step={1}
        value={[index]}
        onValueChange={([next]) => choose(next)}
        getValueText={(position) => `${levels[position]?.label ?? ''} ${label.toLowerCase()}`.trim()}
        disabled={disabled}
      />
      {compact ? null : (
        <>
          {/* Step labels are a pointer shortcut; the slider itself carries the keyboard and the name. */}
          <div aria-hidden='true' className='text-text-muted grid text-xs' style={{ gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))` }}>
            {levels.map((item, itemIndex) => (
              <button
                key={item.value}
                type='button'
                tabIndex={-1}
                disabled={disabled}
                onClick={() => choose(itemIndex)}
                className={cn(
                  'hover:text-text cursor-pointer truncate py-0.5 disabled:cursor-not-allowed',
                  itemIndex === 0 ? 'text-start' : itemIndex === levels.length - 1 ? 'text-end' : 'text-center',
                  itemIndex === index && 'text-text font-medium'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          {level?.description ? <p id={descriptionId} className='text-text-muted text-xs'>{level.description}</p> : null}
        </>
      )}
    </div>
  );
}

export { ChatEffortSlider, DEFAULT_LEVELS as chatEffortLevels };
