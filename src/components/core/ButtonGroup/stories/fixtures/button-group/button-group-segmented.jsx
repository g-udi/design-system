'use client';
import { useState } from 'react';
import { Badge, StatusDot } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText
} from '@gaudi/design-system/core/ButtonGroup';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';
import { ToggleGroupRoot, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const views = [['List view', 'ListIcon'], ['Grid view', 'LayoutGridIcon'], ['Table view', 'TableIcon']];
const intervals = [['1m', 'ClockIcon'], ['5m', 'ClockIcon'], ['1H', 'ClockIcon'], ['1D', 'CalendarIcon'], ['1W', 'CalendarDaysIcon'], ['Auto', 'SparklesIcon']];
const modes = [['Assist', 'MessageSquareIcon'], ['Review', 'ShieldCheckIcon'], ['Auto', 'ZapIcon']];
const limits = ['2k credits', '10k credits', 'Unlimited'];
const stances = [['Buy', 'TrendingUpIcon'], ['Hold', 'MinusIcon'], ['Sell', 'TrendingDownIcon']];
const models = [
  { id: 'swift', icon: 'ZapIcon', badge: 'Fast', tone: 'success-light', tip: 'Short answers, quickest to respond' },
  { id: 'sage', icon: 'BrainIcon', badge: 'Pro', tone: 'info-light', tip: 'Longer reasoning for research and editing' },
  { id: 'nova', icon: 'FlaskConicalIcon', badge: 'Preview', tone: 'warning-light', tip: 'Whole-archive context, still in preview' }
];
const environments = [
  { id: 'Dev', icon: 'Code2Icon', tip: 'Your machine, with sample content' },
  { id: 'Staging', icon: 'TestTube2Icon', tip: 'Private copy of the live site' },
  { id: 'Production', icon: 'GlobeIcon', tip: 'Public site, visible to every reader' }
];
function Row({ label, children }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <span className='text-xs text-text-muted'>{label}</span>
      <div className='flex flex-wrap items-center gap-2'>{children}</div>
    </div>
  );
}
export function Pattern() {
  const [view, setView] = useState('List view');
  const [interval, setInterval] = useState('1H');
  const [mode, setMode] = useState('Review');
  const [limit, setLimit] = useState(limits[1]);
  const [stance, setStance] = useState('');
  const [model, setModel] = useState('sage');
  const [env, setEnv] = useState('Production');
  const [score, setScore] = useState('8');
  return (
    <TooltipProvider>
      <div className='mx-auto flex w-full max-w-lg flex-col gap-3'>
        <Row label='View and interval'>
          <ToggleGroupRoot type='single' aria-label='View' value={view} onValueChange={(next) => next && setView(next)} variant='outline' spacing={0}>
            {views.map(([id, icon]) => (
              <ToggleGroupItem key={id} value={id} aria-label={id}><RegistryIcon aria-hidden='true' lucide={icon} /></ToggleGroupItem>
            ))}
          </ToggleGroupRoot>
          <ToggleGroupRoot type='single' aria-label='Interval' value={interval} onValueChange={(next) => next && setInterval(next)} variant='outline' size='sm' spacing={0} className='max-w-full overflow-x-auto'>
            {intervals.map(([id, icon]) => (
              <ToggleGroupItem key={id} value={id} className='tabular-nums'><RegistryIcon aria-hidden='true' lucide={icon} />{id}</ToggleGroupItem>
            ))}
          </ToggleGroupRoot>
        </Row>
        <Row label='Mode with a menu'>
          <ButtonGroup className='max-w-full overflow-x-auto'>
            <ToggleGroupRoot type='single' aria-label='Agent mode' value={mode} onValueChange={(next) => next && setMode(next)} variant='outline' size='sm' spacing={0}>
              {modes.map(([id, icon]) => (
                <ToggleGroupItem key={id} value={id}><RegistryIcon aria-hidden='true' lucide={icon} className='size-3.5 opacity-60' />{id}</ToggleGroupItem>
              ))}
            </ToggleGroupRoot>
            <ButtonGroupSeparator />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='shrink-0' aria-label={`Credit cap: ${limit}`}>
                  {limit}
                  <RegistryIcon aria-hidden='true' lucide='ChevronDownIcon' className='size-3 opacity-60' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-32'>
                <DropdownMenuRadioGroup value={limit} onValueChange={setLimit}>
                  {limits.map((item) => <DropdownMenuRadioItem key={item} value={item}>{item}</DropdownMenuRadioItem>)}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
          <ToggleGroupRoot type='single' aria-label='Position' value={stance} onValueChange={setStance} variant='outline' size='sm' spacing={0}>
            {stances.map(([id, icon]) => (
              <ToggleGroupItem key={id} value={id}><RegistryIcon aria-hidden='true' lucide={icon} />{id}</ToggleGroupItem>
            ))}
          </ToggleGroupRoot>
        </Row>
        <Row label='With tooltips, badges and status'>
          <ToggleGroupRoot type='single' aria-label='Model' value={model} onValueChange={(next) => next && setModel(next)} variant='outline' size='sm' spacing={0} className='max-w-full overflow-x-auto'>
            {models.map(({ id, icon, badge, tone, tip }) => (
              <Tooltip key={id}>
                <ToggleGroupItem value={id} asChild>
                  <TooltipTrigger>
                    <RegistryIcon aria-hidden='true' lucide={icon} />
                    {id}
                    <Badge variant={tone} size='xs'>{badge}</Badge>
                  </TooltipTrigger>
                </ToggleGroupItem>
                <TooltipContent>{tip}</TooltipContent>
              </Tooltip>
            ))}
          </ToggleGroupRoot>
          <ButtonGroup className='max-w-full overflow-x-auto'>
            <ToggleGroupRoot type='single' aria-label='Environment' value={env} onValueChange={(next) => next && setEnv(next)} variant='outline' size='sm' spacing={0}>
              {environments.map(({ id, icon, tip }) => (
                <Tooltip key={id}>
                  <ToggleGroupItem value={id} asChild>
                    <TooltipTrigger><RegistryIcon aria-hidden='true' lucide={icon} />{id}</TooltipTrigger>
                  </ToggleGroupItem>
                  <TooltipContent>{tip}</TooltipContent>
                </Tooltip>
              ))}
            </ToggleGroupRoot>
            {env === 'Production' ? (
              <ButtonGroupText className='gap-1.5 border border-border px-2.5 text-xs text-text-muted'>
                <StatusDot className='bg-success' />
                Live
              </ButtonGroupText>
            ) : null}
          </ButtonGroup>
        </Row>
        <Row label='How useful was this article?'>
          <div className='flex max-w-full flex-col gap-1.5'>
            <ToggleGroupRoot type='single' aria-label='Score' value={score} onValueChange={(next) => next && setScore(next)} variant='outline' size='sm' spacing={0} className='max-w-full overflow-x-auto'>
              {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((n) => (
                <ToggleGroupItem key={n} value={n} className='tabular-nums'>{n}</ToggleGroupItem>
              ))}
            </ToggleGroupRoot>
            <div className='flex justify-between text-xs text-text-muted'>
              <span>Not useful</span>
              <span>Very useful</span>
            </div>
          </div>
        </Row>
      </div>
    </TooltipProvider>
  );
}
