'use client';
import { isValidElement, useState } from 'react';
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

// A model's mark: a brand component (rendered at icon size; marks without colours of their own follow
// the text colour) or a ready element.
function ModelIcon({ icon, className }) {
  if (!icon) return null;
  if (typeof icon === 'string') return <RegistryIcon lucide={icon} aria-hidden='true' className={className} />;
  if (isValidElement(icon)) return icon;
  const Icon = icon;
  return <Icon aria-hidden='true' className={cn('size-4 shrink-0 fill-current', className)} />;
}

const BADGE_TONES = {
  neutral: 'text-text-muted bg-surface-muted',
  accent: 'bg-accent-subtle text-accent',
  success: 'bg-success/10 text-ui-success-ink',
  discovery: 'bg-discovery/10 text-ui-discovery-ink'
};

/**
 * Picks the model a prompt runs on, from the composer toolbar or a page header. `models` are
 * `{ value, label, description?, details?, badge?, badgeTone?, icon?, disabled? }`: `icon` is a brand
 * component, a registry icon name or an element, shown in the list and on the trigger; `details` are
 * short facts joined by dots under the name (provider, context, strength); `badgeTone` is `neutral`
 * (default), `accent`, `success` or `discovery`. `value` / `defaultValue` / `onValueChange(value, model)`
 * follow the model's `value`. The trigger names the choice ("Model: Balanced"); `variant` and `size` set
 * its Button look (ghost xs by default), `icon={false}` drops the sparkle shown for models without an
 * icon, and `contentClassName` sizes the menu. `children` add a footer,
 * such as a ChatEffortSlider or a note, under the list.
 */
function ChatModelSelect({
  models = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  label = 'Model',
  align = 'start',
  variant = 'ghost',
  size = 'xs',
  icon = true,
  contentClassName,
  className,
  children
}) {
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
        <Button size={size} variant={variant} aria-label={`${label}: ${current?.label ?? ''}`} className={cn('ds-part-chat-model-select gap-1', className)}>
          {current?.icon ? <ModelIcon icon={current.icon} /> : icon ? <RegistryIcon lucide='Sparkles' /> : null}
          <span className='max-w-36 truncate'>{current?.label}</span>
          <RegistryIcon lucide='ChevronDown' className='text-text-muted' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn('w-64', contentClassName)}>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={choose}>
          {models.map((model) => (
            <DropdownMenuRadioItem key={model.value} value={model.value} disabled={model.disabled} className='items-start gap-2'>
              {model.icon ? <ModelIcon icon={model.icon} className='mt-0.5' /> : null}
              <span className='grid min-w-0 gap-0.5'>
                <span className='flex items-center gap-2'>
                  <span className='font-medium'>{model.label}</span>
                  {model.badge ? <span className={cn('rounded-(--ds-radius-control) px-1.5 text-xs font-medium', BADGE_TONES[model.badgeTone] || BADGE_TONES.neutral)}>{model.badge}</span> : null}
                </span>
                {model.description ? <span className='text-text-muted text-xs'>{model.description}</span> : null}
                {model.details?.length ? (
                  <span className='text-text-muted flex flex-wrap items-center gap-x-1.5 text-xs'>
                    {model.details.map((detail, index) => (
                      <span key={detail} className='flex items-center gap-1.5'>
                        {index ? <span aria-hidden='true' className='bg-text-muted/60 size-0.5 rounded-full' /> : null}
                        {detail}
                      </span>
                    ))}
                  </span>
                ) : null}
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
