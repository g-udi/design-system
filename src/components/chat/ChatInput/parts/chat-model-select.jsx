'use client';
import { useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

/**
 * Picks the model a prompt runs on, from the composer toolbar. `models` are
 * `{ value, label, description?, badge?, disabled? }`; `value` / `defaultValue` / `onValueChange(value, model)`
 * follow the model's `value`. The trigger names the choice ("Model: Balanced"); `children` add a footer,
 * such as a ChatEffortSlider, under the list.
 */
function ChatModelSelect({ models = [], value: valueProp, defaultValue, onValueChange, label = 'Model', align = 'start', className, children }) {
  const [internal, setInternal] = useState(defaultValue ?? models[0]?.value);
  const value = valueProp === undefined ? internal : valueProp;
  const current = models.find((model) => model.value === value);
  const choose = (next) => {
    setInternal(next);
    onValueChange?.(next, models.find((model) => model.value === next));
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='xs' variant='ghost' aria-label={`${label}: ${current?.label ?? ''}`} className={cn('ds-part-chat-model-select gap-1', className)}>
          <RegistryIcon lucide='Sparkles' />
          <span className='max-w-28 truncate'>{current?.label}</span>
          <RegistryIcon lucide='ChevronDown' className='text-text-muted' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className='w-64'>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={choose}>
          {models.map((model) => (
            <DropdownMenuRadioItem key={model.value} value={model.value} disabled={model.disabled} className='items-start'>
              <span className='grid min-w-0 gap-0.5'>
                <span className='flex items-center gap-2'>
                  <span className='font-medium'>{model.label}</span>
                  {model.badge ? <span className='text-text-muted bg-surface-muted rounded-(--ds-radius-control) px-1.5 text-xs font-medium'>{model.badge}</span> : null}
                </span>
                {model.description ? <span className='text-text-muted text-xs'>{model.description}</span> : null}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {children ? (
          <>
            <DropdownMenuSeparator />
            {/* Footer controls keep their own keys, so arrow keys stay with the slider instead of the menu. */}
            <div className='px-2 py-2' onKeyDown={(event) => event.stopPropagation()}>{children}</div>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ChatModelSelect };
