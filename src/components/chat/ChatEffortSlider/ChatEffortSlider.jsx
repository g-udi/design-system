'use client';
import { useId } from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { cn } from '../../../utilities/cn/index.js';
import Button from '../../core/Button/index.js';
import { Slider } from '../../core/Slider/Slider.jsx';

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
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue: fallback, onChange: (next) => onValueChange?.(next, levels.find((item) => item.value === next)) });
  const index = Math.max(0, levels.findIndex((level) => level.value === value));
  const level = levels[index];
  const descriptionId = useId();
  const choose = (nextIndex) => {
    const next = levels[nextIndex];
    if (!next || next.value === value) return;
    setValue(next.value);
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
        aria-describedby={!compact && level?.description ? descriptionId : undefined}
        min={0}
        max={Math.max(1, levels.length - 1)}
        step={1}
        value={[index]}
        onValueChange={([next]) => choose(next)}
        getValueText={(position) => `${levels[position]?.label ?? ''} ${label.toLowerCase()}`.trim()}
        disabled={disabled || levels.length < 2}
      />
      {compact ? null : (
        <>
          {/* Step labels are a pointer shortcut; the slider itself carries the keyboard and the name. */}
          <div aria-hidden='true' className='text-text-muted grid text-xs' style={{ gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))` }}>
            {levels.map((item, itemIndex) => (
              <Button
                key={item.value}
                variant='subtle'
                tone='neutral'
                size='xs'
                tabIndex={-1}
                disabled={disabled || levels.length < 2}
                onClick={() => choose(itemIndex)}
                className={cn(
                  'min-h-0 px-0 py-0.5 font-normal',
                  itemIndex === 0 ? 'justify-start' : itemIndex === levels.length - 1 ? 'justify-end' : 'justify-center',
                  itemIndex === index && 'text-text font-medium'
                )}
              >
                <span className='truncate'>{item.label}</span>
              </Button>
            ))}
          </div>
          {level?.description ? <p id={descriptionId} className='text-text-muted text-xs'>{level.description}</p> : null}
        </>
      )}
    </div>
  );
}

export { ChatEffortSlider, DEFAULT_LEVELS as chatEffortLevels };
