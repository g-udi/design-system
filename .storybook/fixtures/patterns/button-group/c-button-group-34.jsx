'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const Icon = ({ name, className }) => <RegistryIcon lucide={name} aria-hidden='true' className={className} />;
const views = [['List view', 'ListIcon'], ['Grid view', 'LayoutGridIcon'], ['Table view', 'TableIcon']];
const intervals = [['1m', 'ClockIcon'], ['5m', 'ClockIcon'], ['1H', 'ClockIcon'], ['1D', 'CalendarIcon'], ['1W', 'CalendarDaysIcon'], ['Auto', 'SparklesIcon']];
const modes = [['Assist', 'MessageSquareIcon'], ['Review', 'ShieldCheckIcon'], ['Auto', 'ZapIcon']];
const limits = ['2k credits', '10k credits', 'Unlimited'];
const stances = [['Buy', 'TrendingUpIcon'], ['Hold', 'MinusIcon'], ['Sell', 'TrendingDownIcon']];
const models = [
  { id: 'swift', icon: 'ZapIcon', badge: 'Fast', tone: 'success-light', tip: '128k context, fastest response' },
  { id: 'sage', icon: 'BrainIcon', badge: 'Pro', tone: 'info-light', tip: '200k context, best for analysis' },
  { id: 'nova', icon: 'FlaskConicalIcon', badge: 'Preview', tone: 'warning-light', tip: '1M context, experimental' }
];
const environments = [
  { id: 'Dev', icon: 'Code2Icon', tip: 'Local development environment' },
  { id: 'Staging', icon: 'TestTube2Icon', tip: 'Pre-production mirror' },
  { id: 'Production', icon: 'GlobeIcon', tip: 'Live environment, affects real users' }
];
const active = 'bg-surface-muted';
// One pressed button per group; the pressed state is announced and tinted.
function Segment({ selected, onSelect, id, size, label, children, ...props }) {
  return (
    <Button
      variant='outline'
      size={size}
      aria-label={label}
      aria-pressed={selected === id}
      className={cn('shrink-0', selected === id && active)}
      onClick={() => onSelect(id)}
      {...props}
    >
      {children}
    </Button>
  );
}
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
  const [stance, setStance] = useState(null);
  const [model, setModel] = useState('sage');
  const [env, setEnv] = useState('Production');
  const [score, setScore] = useState(8);
  return (
    <TooltipProvider>
      <div className='mx-auto flex w-full max-w-lg flex-col gap-3'>
        <Row label='View and interval'>
          <ButtonGroup aria-label='View'>
            {views.map(([id, icon]) => (
              <Segment key={id} id={id} label={id} size='icon' selected={view} onSelect={setView}><Icon name={icon} /></Segment>
            ))}
          </ButtonGroup>
          <ButtonGroup aria-label='Interval' className='max-w-full overflow-x-auto'>
            {intervals.map(([id, icon]) => (
              <Segment key={id} id={id} size='sm' className='tabular-nums' selected={interval} onSelect={setInterval}><Icon name={icon} />{id}</Segment>
            ))}
          </ButtonGroup>
        </Row>
        <Row label='Mode with a menu'>
          <ButtonGroup aria-label='Agent mode' className='max-w-full overflow-x-auto'>
            {modes.map(([id, icon]) => (
              <Segment key={id} id={id} size='sm' selected={mode} onSelect={setMode}><Icon name={icon} className='size-3.5 opacity-60' />{id}</Segment>
            ))}
            <ButtonGroupSeparator />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='shrink-0' aria-label={`Credit cap: ${limit}`}>
                  {limit}
                  <Icon name='ChevronDownIcon' className='size-3 opacity-60' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-32'>
                {limits.map((item) => <DropdownMenuItem key={item} onClick={() => setLimit(item)}>{item}</DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
          <ButtonGroup aria-label='Position'>
            {stances.map(([id, icon]) => (
              <Button key={id} size='sm' variant={stance === id ? 'default' : 'outline'} aria-pressed={stance === id} onClick={() => setStance(stance === id ? null : id)}>
                <Icon name={icon} />
                {id}
              </Button>
            ))}
          </ButtonGroup>
        </Row>
        <Row label='With tooltips, badges and status'>
          <ButtonGroup aria-label='Model' className='max-w-full overflow-x-auto'>
            {models.map(({ id, icon, badge, tone, tip }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <Segment id={id} size='sm' selected={model} onSelect={setModel} className='capitalize'>
                    <Icon name={icon} />
                    {id}
                    <Badge variant={tone} size='xs'>{badge}</Badge>
                  </Segment>
                </TooltipTrigger>
                <TooltipContent>{tip}</TooltipContent>
              </Tooltip>
            ))}
          </ButtonGroup>
          <ButtonGroup aria-label='Environment' className='max-w-full overflow-x-auto'>
            {environments.map(({ id, icon, tip }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <Segment id={id} size='sm' selected={env} onSelect={setEnv}><Icon name={icon} />{id}</Segment>
                </TooltipTrigger>
                <TooltipContent>{tip}</TooltipContent>
              </Tooltip>
            ))}
            {env === 'Production' ? (
              <ButtonGroupText className='gap-1.5 border border-border px-2.5 text-xs text-text-muted'>
                <span className='size-1.5 rounded-full bg-success' />
                Live
              </ButtonGroupText>
            ) : null}
          </ButtonGroup>
        </Row>
        <Row label='How likely are you to recommend us?'>
          <div className='flex max-w-full flex-col gap-1.5'>
            <ButtonGroup aria-label='Score' className='max-w-full overflow-x-auto'>
              {Array.from({ length: 10 }, (_, index) => index + 1).map((n) => (
                <Button
                  key={n}
                  size='icon-sm'
                  variant={score === n ? 'default' : 'outline'}
                  aria-pressed={score === n}
                  className='text-xs tabular-nums'
                  onClick={() => setScore(n)}
                >
                  {n}
                </Button>
              ))}
            </ButtonGroup>
            <div className='flex justify-between text-xs text-text-muted'>
              <span>Not likely</span>
              <span>Very likely</span>
            </div>
          </div>
        </Row>
      </div>
    </TooltipProvider>
  );
}
