'use client';
import { NumberField, NumberFieldGroup, NumberFieldDecrement, NumberFieldInput, NumberFieldIncrement } from '@gaudi/design-system/core/NumberField';
import { Toggle } from '@gaudi/design-system/core/ToggleGroup';
import { useState } from 'react';
import { FieldInput } from '@gaudi/design-system/core/Field';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ButtonGroup } from '@gaudi/design-system/core/ButtonGroup';
import { cn } from '@gaudi/design-system/utilities/cn';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const nav = [['Dashboard', 'LayoutDashboardIcon'], ['Analytics', 'BarChart2Icon'], ['Settings', 'SettingsIcon'], ['Help', 'CircleHelpIcon']];
const sections = { Dashboard: ['Reader dashboard', 'Project updates'], Analytics: ['Traffic report', 'Referral sources'], Settings: ['Email preferences', 'Workspace settings'], Help: ['Getting started', 'Contact support'] };
export function Pattern() {
  const [active, setActive] = useState('Dashboard');
  const [quantity, setQuantity] = useState(2);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [removed, setRemoved] = useState([]);
  const { copy, isCopied } = useCopyToClipboard();
  const items = sections[active].filter((name) => !removed.includes(name) && name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className='mx-auto flex w-full max-w-lg flex-wrap items-start justify-center gap-3'>
      <ButtonGroup orientation='vertical' aria-label='Sections' className='w-40'>
        {nav.map(([label, icon]) => (
          <Button
            key={label}
            variant='outline'
            aria-current={active === label ? 'page' : undefined}
            className={cn('justify-start', active === label && 'bg-surface-muted')}
            onClick={() => { setActive(label); setQuery(''); }}
          >
            <RegistryIcon aria-hidden='true' lucide={icon} />
            {label}
          </Button>
        ))}
      </ButtonGroup>
      <NumberField min={0} value={quantity} onValueChange={value => setQuantity(value ?? 0)} size='sm' className='w-12'>
        <NumberFieldGroup className='h-auto flex-col'>
          <NumberFieldIncrement aria-label='Add' />
          <NumberFieldInput aria-label='Entries per section' />
          <NumberFieldDecrement aria-label='Subtract' />
        </NumberFieldGroup>
      </NumberField>
      <ButtonGroup orientation='vertical' aria-label='Tool palette'>
        <ButtonGroup orientation='vertical'>
          <Toggle variant='outline' size='sm' aria-label='Search this section' pressed={searching} onPressedChange={() => { setSearching(!searching); setQuery(''); }}><RegistryIcon aria-hidden='true' lucide='SearchIcon' /></Toggle>
          <Button variant='outline' size='icon' aria-label={isCopied ? 'Copied section' : 'Copy section'} disabled={!items.length || quantity === 0} onClick={() => copy(items.slice(0, quantity).join('\n'))}><RegistryIcon aria-hidden='true' lucide='CopyIcon' /></Button>
        </ButtonGroup>
        <ButtonGroup orientation='vertical'>
          <Button variant='outline' size='icon' aria-label='Remove first entry' disabled={!items.length || quantity === 0} onClick={() => setRemoved((entries) => [...entries, items[0]])}><RegistryIcon aria-hidden='true' lucide='Trash2Icon' /></Button>
        </ButtonGroup>
      </ButtonGroup>
      <section className='w-full space-y-1 text-sm' aria-label='Section preview'>
        <h3 className='font-medium'>{active}</h3>
        {searching && <FieldInput aria-label='Search entries' value={query} onChange={(event) => setQuery(event.target.value)} />}
        <ul>{items.slice(0, quantity).map((item) => <li key={item}>{item}</li>)}</ul>
        <output>{quantity} {quantity === 1 ? 'entry' : 'entries'} per section</output>
      </section>
    </div>
  );
}
