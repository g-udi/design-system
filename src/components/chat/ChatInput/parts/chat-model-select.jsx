'use client';
import { Fragment, isValidElement, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../../core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../core/DropdownMenu/parts/dropdown-menu.jsx';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../../core/Commander/parts/command.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../../../core/Popover/parts/popover.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { chatModelProviders, formatTokenCount } from './chat-models.js';

// A mark: a brand component (rendered at icon size; marks without colours of their own follow the text
// colour), a registry icon name or a ready element.
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

const CAPABILITIES = {
  vision: { label: 'Vision', icon: 'Eye' },
  reasoning: { label: 'Reasoning', icon: 'Brain' },
  tools: { label: 'Tools', icon: 'Wrench' },
  web: { label: 'Web search', icon: 'Globe' },
  files: { label: 'Files', icon: 'FileText' },
  audio: { label: 'Audio', icon: 'AudioLines' },
  code: { label: 'Code', icon: 'Code' },
  image: { label: 'Image output', icon: 'Palette' }
};
const SPEEDS = { fast: 'Fast', balanced: 'Balanced', slow: 'Slower' };

/** The short facts under a model's name: its own `details`, then context, speed and cost. */
function modelFacts(model) {
  const facts = [...(model.details || [])];
  if (model.contextWindow) facts.push(`${formatTokenCount(model.contextWindow)} context`);
  if (model.speed) facts.push(SPEEDS[model.speed] || model.speed);
  return facts;
}

function ModelSummary({ model }) {
  const facts = modelFacts(model);
  const capabilities = (model.capabilities || []).map((key) => ({ key, ...(CAPABILITIES[key] || { label: key, icon: 'Sparkles' }) }));
  return (
    <span className='grid min-w-0 flex-1 gap-0.5'>
      <span className='flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5'>
        <span className='truncate font-medium'>{model.label}</span>
        {model.badge ? <span className={cn('rounded-(--ds-radius-control) px-1.5 text-xs font-medium', BADGE_TONES[model.badgeTone] || BADGE_TONES.neutral)}>{model.badge}</span> : null}
      </span>
      {model.description ? <span className='text-text-muted text-xs'>{model.description}</span> : null}
      {facts.length || model.cost || capabilities.length ? (
        <span className='text-text-muted flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs'>
          {facts.map((fact, index) => (
            <span key={fact} className='flex items-center gap-1.5'>
              {index ? <span aria-hidden='true' className='bg-text-muted/60 size-0.5 rounded-full' /> : null}
              {fact}
            </span>
          ))}
          {model.cost ? (
            <span className='flex items-center gap-1.5'>
              {facts.length ? <span aria-hidden='true' className='bg-text-muted/60 size-0.5 rounded-full' /> : null}
              <span aria-hidden='true' className='tracking-tight'>
                <span className='text-text'>{'$'.repeat(model.cost)}</span>
                <span className='opacity-40'>{'$'.repeat(Math.max(0, 4 - model.cost))}</span>
              </span>
              <span className='sr-only'>{`Cost ${model.cost} of 4`}</span>
            </span>
          ) : null}
          {capabilities.length ? (
            <span data-slot='chat-model-capabilities' className='flex items-center gap-1'>
              {capabilities.map((capability) => (
                <span
                  key={capability.key}
                  data-slot='chat-model-capability'
                  title={capability.label}
                  className='bg-surface-muted text-text-muted inline-grid size-5 place-items-center rounded-(--ds-radius-control) [&_svg]:size-3'
                >
                  <RegistryIcon lucide={capability.icon} aria-hidden='true' />
                  <span className='sr-only'>{capability.label}</span>
                </span>
              ))}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}

/** Models in provider groups, in the order providers first appear; ungrouped models share one group. */
function groupModels(models, providers) {
  const groups = new Map();
  for (const model of models) {
    const key = model.provider || '';
    if (!groups.has(key)) {
      const provider = providers[key] || (key ? { value: key, label: key } : null);
      groups.set(key, { key, provider, models: [] });
    }
    groups.get(key).models.push(model);
  }
  return [...groups.values()];
}

function GroupHeading({ provider }) {
  return (
    <span className='flex items-center gap-1.5'>
      {provider.icon ? <ModelIcon icon={provider.icon} className='size-3.5' /> : null}
      {provider.label}
    </span>
  );
}

/**
 * Picks the model a prompt runs on, from the composer toolbar or a page header. `models` are
 * `{ value, label, provider?, description?, details?, badge?, badgeTone?, icon?, contextWindow?,
 * capabilities?, speed?, cost?, pricing?, disabled? }` — `chatModels` is a ready catalogue of Claude,
 * OpenAI and Gemini models to start from. Models with a `provider` are grouped under that provider's
 * name and mark (from `providers`, `chatModelProviders` by default). `capabilities` (`vision`,
 * `reasoning`, `tools`, `web`, `files`, `audio`, `code`, `image`) show as small named icons;
 * `contextWindow` (tokens), `speed` (`fast`, `balanced`, `slow`) and `cost` (1 to 4) join `details`
 * under the name. `searchable` swaps the menu for a command list with a search field, for longer
 * catalogues. `value` / `defaultValue` / `onValueChange(value, model)` follow the model's `value`. The
 * trigger names the choice ("Model: Claude Sonnet 5"); `variant` and `size` set its Button look (ghost
 * xs by default), `icon={false}` drops the sparkle shown for models without an icon, and
 * `contentClassName` sizes the list. `children` add a footer, such as a ChatEffortSlider or a note.
 */
function ChatModelSelect({
  models = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  label = 'Model',
  align = 'start',
  side,
  variant = 'ghost',
  size = 'xs',
  icon = true,
  searchable = false,
  searchPlaceholder = 'Search models...',
  emptyText = 'No models found.',
  providers = chatModelProviders,
  open: openProp,
  onOpenChange,
  contentClassName,
  className,
  children
}) {
  const [internal, setInternal] = useState(defaultValue ?? models[0]?.value);
  const [openInternal, setOpenInternal] = useState(false);
  const open = openProp ?? openInternal;
  const setOpen = (next) => {
    setOpenInternal(next);
    onOpenChange?.(next);
  };
  const value = valueProp === undefined ? internal : valueProp;
  const current = models.find((model) => model.value === value);
  const groups = groupModels(models, providers);
  const grouped = groups.some((group) => group.provider);
  const choose = (next) => {
    setInternal(next);
    onValueChange?.(next, models.find((model) => model.value === next));
  };

  const trigger = (
    <Button
      size={size}
      variant={variant}
      aria-label={`${label}: ${current?.label ?? ''}`}
      data-slot='chat-model-select'
      className={cn('ds-part-chat-model-select min-w-0 gap-1', className)}
    >
      {current?.icon ? <ModelIcon icon={current.icon} /> : icon ? <RegistryIcon lucide='Sparkles' /> : null}
      <span className='max-w-24 truncate sm:max-w-36'>{current?.label}</span>
      <RegistryIcon lucide='ChevronDown' className='text-text-muted' />
    </Button>
  );

  // Footer controls keep their own keys, so arrow keys stay with a slider instead of the list.
  const footer = children ? <div className='border-t px-2 py-2' onKeyDown={(event) => event.stopPropagation()}>{children}</div> : null;

  if (searchable) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align={align}
          side={side}
          collisionPadding={8}
          aria-label={label}
          className={cn('w-[min(22rem,calc(100vw-1rem))] gap-0 overflow-hidden p-0', contentClassName)}
        >
          {/* cmdk names its input through its label (aria-labelledby), so the search field reads "Search models". */}
          <Command loop defaultValue={value} label={searchPlaceholder.replace(/[.…]+$/, '')} className='h-auto'>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList className='max-h-[min(22rem,50vh)]'>
              <CommandEmpty>{emptyText}</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.key || 'models'} heading={grouped && group.provider ? <GroupHeading provider={group.provider} /> : undefined}>
                  {group.models.map((model) => (
                    <CommandItem
                      key={model.value}
                      value={model.value}
                      keywords={[model.label, group.provider?.label, ...(model.capabilities || []), model.description].filter(Boolean)}
                      disabled={model.disabled}
                      data-checked={model.value === value}
                      aria-checked={model.value === value}
                      onSelect={() => {
                        choose(model.value);
                        setOpen(false);
                      }}
                      className='items-start gap-2'
                    >
                      {model.icon ? <ModelIcon icon={model.icon} className='mt-0.5' /> : null}
                      <ModelSummary model={model} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
          {footer}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} collisionPadding={8} className={cn('w-[min(18rem,calc(100vw-1rem))]', contentClassName)}>
        {grouped ? null : <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        <DropdownMenuRadioGroup value={value} onValueChange={choose}>
          {groups.map((group, index) => (
            <Fragment key={group.key || 'models'}>
              {index ? <DropdownMenuSeparator /> : null}
              <DropdownMenuGroup>
                {grouped && group.provider ? (
                  <DropdownMenuLabel className='text-text-muted text-xs'>
                    <GroupHeading provider={group.provider} />
                  </DropdownMenuLabel>
                ) : null}
                {group.models.map((model) => (
                  <DropdownMenuRadioItem key={model.value} value={model.value} disabled={model.disabled} className='items-start gap-2'>
                    {model.icon ? <ModelIcon icon={model.icon} className='mt-0.5' /> : null}
                    <ModelSummary model={model} />
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuGroup>
            </Fragment>
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

export { ChatModelSelect, ModelIcon };
