'use client';
import { useEffect, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { CarouselContent, CarouselItem, CarouselRoot } from '@gaudi/design-system/core/Carousel';
import { default as EmptyState } from '@gaudi/design-system/core/EmptyState';
import { default as Field, FieldError, FieldLabel } from '@gaudi/design-system/core/Field';
import { default as Input } from '@gaudi/design-system/core/Input';
import { Label } from '@gaudi/design-system/core/Field';
import { default as RadioGroup } from '@gaudi/design-system/core/RadioGroup';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { default as Wizard } from '@gaudi/design-system/blocks/Wizard';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { cn } from '@gaudi/design-system/utilities/cn';

const steps = [
  { id: 'site', label: 'Your site', description: 'Name and address' },
  { id: 'goal', label: 'Goal', description: 'What you publish' },
  { id: 'template', label: 'Template', description: 'Starting layout' },
  { id: 'look', label: 'Look', description: 'Colour and type' },
  { id: 'audience', label: 'Audience', description: 'Newsletter and comments' },
  { id: 'launch', label: 'Launch', description: 'Go live' }
];
// One screenshot per step; the rail scrolls to the step being answered.
const shots = [
  ['static/images/art/1.svg', 'Your home page with the latest posts'],
  ['static/images/art/4.svg', 'Series and collections for long-running topics'],
  ['static/images/art/6.svg', 'Templates for essays, notes and link posts'],
  ['static/images/art/8.svg', 'Themes that follow your brand colour'],
  ['static/images/art/10.svg', 'A newsletter that sends itself'],
  ['static/images/art/2.svg', 'Analytics from the first visitor']
];
const templates = [
  { value: 'journal', label: 'Journal', description: 'A single column of essays.' },
  { value: 'magazine', label: 'Magazine', description: 'Featured stories over a grid.' },
  { value: 'notes', label: 'Notes', description: 'Short posts and links, newest first.' }
];

function Rail({ step }) {
  const [api, setApi] = useState();
  useEffect(() => {
    api?.scrollTo(Math.min(step, shots.length - 1));
  }, [api, step]);
  return (
    <div className='grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden rounded-lg bg-surface-muted p-4'>
      <div className='grid gap-1'>
        <p className='text-lg font-semibold text-balance'>Publish your first post in under ten minutes</p>
        <p className='text-text-muted text-sm'>Writers on Gaudi ship their first issue on day one.</p>
      </div>
      <CarouselRoot setApi={setApi} opts={{ align: 'start' }} aria-label='Product screenshots'>
        <CarouselContent>
          {shots.map(([src, caption], index) => (
            <CarouselItem key={src} className='basis-4/5'>
              <figure className='grid gap-2'>
                <img src={src} alt='' className={cn('aspect-[4/3] w-full rounded-md border object-cover transition-opacity', index !== step && 'opacity-50')} />
                <figcaption className='text-text-muted text-xs'>{caption}</figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselRoot>
    </div>
  );
}

export function Pattern() {
  const [site, setSite] = useState('');
  const [goal, setGoal] = useState(['essays']);
  const [template, setTemplate] = useState('journal');
  const [color, setColor] = useState('accent');
  const [newsletter, setNewsletter] = useState(true);
  const [comments, setComments] = useState(false);
  const [checked, setChecked] = useState(false);
  const [round, setRound] = useState(0);
  return (
    <div className='w-full max-w-5xl rounded-xl border p-5'>
      <Wizard
        key={round}
        title='Create your publication'
        description='Jump back to any finished step from the list.'
        steps={steps}
        indicator='vertical'
        navigable
        aside={(active, complete) => (complete ? null : <Rail step={active} />)}
        validateStep={(index) => {
          const ok = index !== 0 || Boolean(site.trim());
          if (!ok) setChecked(true);
          return ok;
        }}
        onComplete={() => new Promise((resolve) => setTimeout(resolve, 500))}
        completeLabel='Launch publication'
        completion={
          <EmptyState
            icon={<RegistryIcon lucide='SparklesIcon' />}
            title={`${site} is live`}
            description='Share the address, or write your first post while the theme settles in.'
            actions={
              <>
                <Button>Write a post</Button>
                <Button variant='outline' onClick={() => setRound((value) => value + 1)}>Start over</Button>
              </>
            }
          />
        }
      >
        {(step) =>
          step === 0 ? (
            <Field>
              <FieldLabel>Publication name</FieldLabel>
              <Input value={site} invalid={checked && !site.trim()} onChange={(event) => setSite(event.target.value)} />
              <FieldError>{checked && !site.trim() ? 'Name your publication.' : null}</FieldError>
            </Field>
          ) : step === 1 ? (
            <div className='grid gap-2'>
              <p id='goal-label' className='text-sm font-medium'>What will you publish?</p>
              <ToggleGroup aria-labelledby='goal-label' type='multiple' variant='outline' size='sm' spacing={2} value={goal} onValueChange={setGoal} className='flex-wrap'>
                {[['essays', 'Essays'], ['newsletter', 'A newsletter'], ['podcast', 'Podcast notes'], ['docs', 'Documentation'], ['links', 'Link posts']].map(([value, label]) => (
                  <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          ) : step === 2 ? (
            <RadioGroup label='Starting template' variant='cards' value={template} onValueChange={setTemplate} options={templates} />
          ) : step === 3 ? (
            <div className='grid gap-2'>
              <p id='color-label' className='text-sm font-medium'>Brand colour</p>
              <ToggleGroup aria-labelledby='color-label' type='single' variant='outline' spacing={2} value={color} onValueChange={(next) => setColor(next || color)}>
                {[['accent', 'bg-accent', 'Blue'], ['success', 'bg-success', 'Green'], ['discovery', 'bg-discovery', 'Purple'], ['warning', 'bg-warning', 'Amber']].map(([value, swatch, label]) => (
                  <ToggleGroupItem key={value} value={value} className='gap-2'>
                    <span aria-hidden='true' className={cn('size-3 rounded-full', swatch)} />
                    {label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          ) : step === 4 ? (
            <div className='grid gap-3'>
              {[['onb-newsletter', 'Send new posts by email', newsletter, setNewsletter], ['onb-comments', 'Let readers comment', comments, setComments]].map(([id, label, value, set]) => (
                <div key={id} className='flex items-center justify-between gap-3 rounded-lg border p-3'>
                  <Label htmlFor={id} className='font-normal'>{label}</Label>
                  <Switch id={id} checked={value} onCheckedChange={set} />
                </div>
              ))}
            </div>
          ) : (
            <ul className='grid gap-2 text-sm'>
              {[
                ['Name', site],
                ['Publishing', goal.length ? `${goal.length} formats` : 'Anything'],
                ['Template', templates.find((item) => item.value === template).label],
                ['Newsletter', newsletter ? 'On' : 'Off'],
                ['Comments', comments ? 'On' : 'Off']
              ].map(([term, value]) => (
                <li key={term} className='flex items-center gap-2 border-b pb-2'>
                  <RegistryIcon lucide='CheckIcon' className='text-success size-4' />
                  <span className='text-text-muted flex-1'>{term}</span>
                  <span className='font-medium'>{value}</span>
                </li>
              ))}
            </ul>
          )
        }
      </Wizard>
    </div>
  );
}
