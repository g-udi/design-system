'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnCount,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay
} from '../../../../src/components/core/KanbanBoard/parts/kanban-extended.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

// A recruiting pipeline: candidate fit, location, interview date, salary band and scorecard state.
// The panel stage holds three candidates at a time, so a fourth shows the count over its limit.
const STAGES = {
  sourced: { title: 'Sourced', dot: 'bg-text-muted' },
  screen: { title: 'Screen', dot: 'bg-info' },
  manager: { title: 'Hiring manager', dot: 'bg-info' },
  panel: { title: 'Panel', dot: 'bg-discovery', limit: 3 },
  scorecard: { title: 'Scorecard', dot: 'bg-attention' },
  offer: { title: 'Offer', dot: 'bg-success' }
};
const SCORECARD = {
  'Not started': 'outline',
  Draft: 'info-light',
  Ready: 'success-light',
  'Needs calibration': 'warning-light'
};
const MATCH = (score) =>
  score >= 50
    ? ['text-success', '*:data-[slot=progress-indicator]:bg-success']
    : score >= 40
      ? ['text-info', '*:data-[slot=progress-indicator]:bg-info']
      : score >= 30
        ? ['text-discovery', '*:data-[slot=progress-indicator]:bg-discovery']
        : ['text-warning', '*:data-[slot=progress-indicator]:bg-warning'];
const face = (portrait) => `/avatars/${portrait}.jpg`;
const candidate = (id, name, role, portrait, match, place, zone, date, band, scorecard, note = 'Scorecard tracked') => ({ id, name, role, avatar: face(portrait), match, place, zone, date, band, scorecard, note });
const INITIAL = {
  sourced: [
    candidate('c1', 'Mina Calder', 'Staff Product Designer', 'women/44', 46, 'Toronto, CA', 'ET', 'May 7', '$178k–$204k', 'Not started'),
    candidate('c2', 'Jon Bell', 'Senior Data Engineer', 'men/32', 38, 'Austin, US', 'CT', 'May 8', '$164k–$188k', 'Draft'),
    candidate('c3', 'Amara Finch', 'Senior UX Researcher', 'women/68', 31, 'Portland, US', 'PT', 'May 10', '$132k–$150k', 'Not started')
  ],
  screen: [
    candidate('c4', 'Priya Rao', 'Principal Frontend Engineer', 'women/21', 58, 'Seattle, US', 'PT', 'May 6', '$196k–$224k', 'Ready'),
    candidate('c5', 'Luca Marin', 'Lifecycle Marketing Lead', 'men/52', 34, 'Madrid, ES', 'CET', 'May 9', '€120k–€138k', 'Draft')
  ],
  manager: [
    candidate('c6', 'Nadia Ellis', 'Product Operations Manager', 'women/12', 54, 'Brooklyn, US', 'ET', 'May 10', '$142k–$164k', 'Ready'),
    candidate('c7', 'Theo Grant', 'Security Engineering Manager', 'men/75', 41, 'Dublin, IE', 'GMT', 'May 11', '€154k–€176k', 'Ready'),
    candidate('c8', 'Keon Wallace', 'GTM Systems Lead', 'men/41', 45, 'Atlanta, US', 'ET', 'May 14', '$138k–$158k', 'Draft')
  ],
  panel: [
    candidate('c9', 'Sara Okafor', 'Design Systems Engineer', 'women/30', 48, 'London, UK', 'GMT', 'May 12', '£118k–£136k', 'Ready'),
    candidate('c10', 'Arun Mehta', 'Senior Platform Engineer', 'men/86', 26, 'Vancouver, CA', 'PT', 'May 13', '$170k–$192k', 'Needs calibration', 'Panel reschedule')
  ],
  scorecard: [
    candidate('c11', 'Elena Torres', 'Senior Recruiter', 'women/47', 44, 'Chicago, US', 'CT', 'May 5', '$126k–$146k', 'Needs calibration'),
    candidate('c12', 'Marco Silva', 'Revenue Systems Analyst', 'men/18', 37, 'Lisbon, PT', 'WET', 'May 6', '€88k–€102k', 'Draft'),
    candidate('c13', 'Mei Watanabe', 'People Analytics Lead', 'women/65', 33, 'Tokyo, JP', 'JST', 'May 8', '¥16m–¥19m', 'Needs calibration')
  ],
  offer: [candidate('c14', 'Dana Kim', 'Engineering Manager', 'women/90', 62, 'Denver, US', 'MT', 'May 4', '$188k–$212k', 'Ready', 'Offer drafted')]
};

function CandidateCard({ item, isOverlay }) {
  const [text, bar] = MATCH(item.match);
  const body = (
    <div className='grid gap-2.5 rounded-lg border border-border bg-surface p-3 text-sm shadow-xs'>
      <div className='flex items-center gap-2'>
        <Avatar className='size-8'>
          <AvatarImage src={item.avatar} alt='' />
          <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className='grid min-w-0 leading-tight'>
          <span className='truncate font-medium text-text'>{item.name}</span>
          <span className='truncate text-xs text-text-muted'>{item.role}</span>
        </span>
      </div>
      <div className='grid gap-1'>
        <div className='flex justify-between text-xs text-text-muted'>
          <span>Match score</span>
          <span className={cn('font-medium tabular-nums', text)}>{item.match}%</span>
        </div>
        <Progress value={item.match} aria-label={`${item.name} match score`} className={cn('h-1.5', bar)} />
      </div>
      <div className='grid gap-1.5 text-xs text-text-muted'>
        <span className='flex items-center gap-2'>
          <RegistryIcon lucide='MapPinIcon' className='size-3.5' />
          <span className='text-text'>{item.place}</span>
          {item.zone}
        </span>
        <span className='flex items-center gap-2'>
          <RegistryIcon lucide='CalendarIcon' className='size-3.5' />
          <span className='text-text tabular-nums'>{item.date}, 2026</span>
        </span>
        <span className='flex items-center gap-2'>
          <RegistryIcon lucide='DollarSignIcon' className='size-3.5' />
          <span className='text-text tabular-nums'>{item.band}</span>
        </span>
      </div>
      <div className='flex items-center gap-2 text-xs text-text-muted'>
        <Badge variant={SCORECARD[item.scorecard]} size='sm'>{item.scorecard}</Badge>
        {item.note === 'Panel reschedule' ? (
          <Badge variant='warning-outline' size='sm' className='ms-auto'>{item.note}</Badge>
        ) : (
          <span className='ms-auto'>{item.note}</span>
        )}
      </div>
    </div>
  );
  return <KanbanItem value={item.id}>{isOverlay ? body : <KanbanItemHandle>{body}</KanbanItemHandle>}</KanbanItem>;
}

function StageColumn({ value, items, isOverlay }) {
  const stage = STAGES[value];
  return (
    <KanbanColumn value={value} className='gap-2 rounded-xl border border-border bg-surface-muted p-2'>
      <div className='flex items-center gap-2 px-1'>
        <span className={cn('size-2 rounded-full', stage.dot)} aria-hidden='true' />
        <h3 className='text-sm font-medium text-text'>{stage.title}</h3>
        <KanbanColumnCount count={items.length} limit={stage.limit} />
      </div>
      <KanbanColumnContent value={value} className='min-h-16'>
        {items.map((item) => (
          <CandidateCard key={item.id} item={item} isOverlay={isOverlay} />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

export function Pattern() {
  const [columns, setColumns] = useState(INITIAL);
  const [byMatch, setByMatch] = useState(false);
  const sorted = (value) => Object.fromEntries(Object.entries(value).map(([key, items]) => [key, [...items].sort((a, b) => b.match - a.match)]));
  const shown = byMatch ? sorted(columns) : columns;
  const all = Object.values(columns).flat();
  return (
    <div className='grid w-full gap-4'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h2 className='text-base font-semibold text-text'>Recruiting pipeline</h2>
          <p className='text-sm text-text-muted'>Track candidate fit, interviews, scorecards, and offer readiness.</p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <Label className='flex items-center gap-2 text-xs font-normal'>
            <Switch size='sm' checked={byMatch} onCheckedChange={(checked) => { setByMatch(checked); if (checked) setColumns(sorted(columns)); }} />
            Best match first
          </Label>
          <Button
            size='sm'
            onClick={() => setColumns({ ...columns, sourced: [candidate(`c${all.length + 20}`, 'New candidate', 'Role to confirm', 'men/11', 0, 'Remote', 'UTC', 'May 15', 'Band to confirm', 'Not started'), ...columns.sourced] })}
          >
            <RegistryIcon lucide='UserPlusIcon' />
            Add candidate
          </Button>
        </div>
      </div>
      <Kanban value={shown} onValueChange={setColumns} getItemValue={(item) => item.id}>
        <KanbanBoard layout='scroll' aria-label='Recruiting pipeline board'>
          {Object.entries(shown).map(([value, items]) => (
            <StageColumn key={value} value={value} items={items} />
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          {({ value, variant }) => {
            if (variant === 'column') return null;
            const item = all.find((entry) => entry.id === value);
            return item ? <CandidateCard item={item} isOverlay /> : null;
          }}
        </KanbanOverlay>
      </Kanban>
    </div>
  );
}
