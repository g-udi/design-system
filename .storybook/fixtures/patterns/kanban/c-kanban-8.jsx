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
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { Discord } from '../../../../src/icons/brands/discord.jsx';
import { Dropbox } from '../../../../src/icons/brands/dropbox.jsx';
import { Openai } from '../../../../src/icons/brands/openai.jsx';
import { Redis } from '../../../../src/icons/brands/redis.jsx';
import { Slack } from '../../../../src/icons/brands/slack.jsx';
import { Stripe } from '../../../../src/icons/brands/stripe.jsx';
import { Supabase } from '../../../../src/icons/brands/supabase.jsx';
import { Zoom } from '../../../../src/icons/brands/zoom.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

// Renewals by risk and close window. Each stage totals the ARR it holds, so moving an account updates
// both columns; cards show the risk tier, ARR and renewal date tiles, account health and the owner.
const STAGES = {
  upcoming: { title: 'Upcoming', dot: 'bg-info' },
  save: { title: 'Save plan', dot: 'bg-danger' },
  executive: { title: 'Executive review', dot: 'bg-warning' },
  legal: { title: 'Security and legal', dot: 'bg-discovery' }
};
const RISK = {
  Critical: { badge: 'destructive-light', dot: 'bg-danger' },
  Warning: { badge: 'warning-light', dot: 'bg-warning' },
  Clear: { badge: 'success-light', dot: 'bg-success' }
};
const HEALTH_BAR = (score) =>
  score < 45 ? '*:data-[slot=progress-indicator]:bg-danger' : score < 70 ? '*:data-[slot=progress-indicator]:bg-warning' : '*:data-[slot=progress-indicator]:bg-success';
const face = (portrait) => `/avatars/${portrait}.jpg`;
// fill-current lets single-colour marks follow the text colour in dark mode.
const mark = (Logo) => <Logo className='size-4 fill-current text-text' aria-hidden='true' />;
const account = (id, logo, name, risk, arr, renews, health, owner, role, portrait, days) => ({ id, logo, name, risk, arr, renews, health, owner, role, avatar: face(portrait), days });
const INITIAL = {
  upcoming: [
    account('r1', mark(Zoom), 'Zoom', 'Clear', 126, 'May 21', 74, 'Eli Ramos', 'Enterprise AM', 'men/52', 21),
    account('r2', mark(Dropbox), 'Dropbox', 'Clear', 158, 'Jun 3', 71, 'Priya Shah', 'Commercial CSM', 'women/68', 34),
    account('r3', mark(Discord), 'Discord', 'Warning', 184, 'May 15', 66, 'Ava Morgan', 'Strategic CSM', 'women/21', 15)
  ],
  save: [
    account('r4', mark(Slack), 'Slack', 'Critical', 342, 'May 6', 32, 'Nora Singh', 'Renewals lead', 'women/30', 6),
    account('r5', mark(Stripe), 'Stripe', 'Critical', 278, 'May 10', 42, 'Ava Morgan', 'Strategic CSM', 'women/21', 10)
  ],
  executive: [
    account('r6', mark(Openai), 'OpenAI', 'Warning', 515, 'May 13', 59, 'Miles Chen', 'Global CSM', 'men/86', 13),
    account('r7', mark(Redis), 'Redis', 'Warning', 228, 'May 22', 64, 'Priya Shah', 'Commercial CSM', 'women/68', 22)
  ],
  legal: [
    account('r8', <RegistryIcon lucide='Github' className='size-4' />, 'GitHub', 'Warning', 397, 'May 8', 48, 'Eli Ramos', 'Enterprise AM', 'men/52', 8),
    account('r9', mark(Supabase), 'Supabase', 'Warning', 448, 'May 18', 57, 'Nora Singh', 'Renewals lead', 'women/30', 18),
    account('r10', <RegistryIcon lucide='Google' className='size-4' />, 'Google', 'Clear', 302, 'May 27', 72, 'Miles Chen', 'Global CSM', 'men/86', 27)
  ]
};
const money = (thousands) => (thousands >= 1000 ? `$${(thousands / 1000).toFixed(2)}M` : `$${thousands}K`);

function Tile({ icon, label, value }) {
  return (
    <div className='flex items-center gap-2 rounded-md border border-border bg-surface-muted px-2 py-1.5'>
      <RegistryIcon lucide={icon} className='size-3.5 shrink-0 text-text-muted' />
      <span className='grid leading-tight'>
        <span className='text-xs text-text-muted'>{label}</span>
        <span className='text-sm font-medium text-text tabular-nums'>{value}</span>
      </span>
    </div>
  );
}

function AccountCard({ item, isOverlay }) {
  const risk = RISK[item.risk];
  const body = (
    <div className='grid gap-2.5 rounded-lg border border-border bg-surface p-3 text-sm shadow-xs'>
      <div className='flex items-center gap-2'>
        {item.logo}
        <span className='min-w-0 flex-1 truncate font-medium text-text'>{item.name}</span>
        <Badge variant={risk.badge} size='sm' className='gap-1'>
          <span className={cn('size-1.5 rounded-full', risk.dot)} aria-hidden='true' />
          {item.risk}
        </Badge>
      </div>
      <div className='grid grid-cols-2 gap-2'>
        <Tile icon='DollarSignIcon' label='ARR' value={money(item.arr)} />
        <Tile icon='CalendarIcon' label='Renews' value={item.renews} />
      </div>
      <div className='grid gap-1'>
        <div className='flex justify-between text-xs text-text-muted'>
          <span>Health</span>
          <span className='font-medium text-text tabular-nums'>{item.health}%</span>
        </div>
        <Progress value={item.health} aria-label={`${item.name} health`} className={cn('h-1.5', HEALTH_BAR(item.health))} />
      </div>
      <div className='flex items-center gap-2 text-xs'>
        <Avatar className='size-6'>
          <AvatarImage src={item.avatar} alt='' />
          <AvatarFallback>{item.owner.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className='grid min-w-0 flex-1 leading-tight'>
          <span className='truncate font-medium text-text'>{item.owner}</span>
          <span className='truncate text-text-muted'>{item.role}</span>
        </span>
        <span className={cn('tabular-nums', item.days <= 10 ? 'font-medium text-danger' : 'text-text-muted')}>{item.days}d left</span>
      </div>
    </div>
  );
  return <KanbanItem value={item.id}>{isOverlay ? body : <KanbanItemHandle>{body}</KanbanItemHandle>}</KanbanItem>;
}

function StageColumn({ value, items, isOverlay }) {
  const stage = STAGES[value];
  const total = items.reduce((sum, item) => sum + item.arr, 0);
  return (
    <KanbanColumn value={value} className='gap-2'>
      <div className='flex items-center gap-2 px-1'>
        <span className={cn('size-2 rounded-full', stage.dot)} aria-hidden='true' />
        <h3 className='text-sm font-medium text-text'>{stage.title}</h3>
        <KanbanColumnCount count={items.length} />
        <span className='ms-auto text-xs text-text-muted tabular-nums'>
          <span className='sr-only'>Total ARR </span>
          {money(total)}
        </span>
      </div>
      <KanbanColumnContent value={value} className='min-h-16'>
        {items.map((item) => (
          <AccountCard key={item.id} item={item} isOverlay={isOverlay} />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

export function Pattern() {
  const [columns, setColumns] = useState(INITIAL);
  const [byWindow, setByWindow] = useState(false);
  const all = Object.values(columns).flat();
  const atRisk = all.filter((item) => item.risk !== 'Clear').reduce((sum, item) => sum + item.arr, 0);
  const sortByWindow = () => {
    setColumns(Object.fromEntries(Object.entries(columns).map(([key, items]) => [key, [...items].sort((a, b) => a.days - b.days)])));
    setByWindow(true);
  };
  return (
    <div className='grid w-full gap-4'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h2 className='flex items-center gap-2 text-base font-semibold text-text'>
            Renewals risk board
            <Badge variant='outline' size='sm' className='tabular-nums'>{all.length}</Badge>
          </h2>
          <p className='text-sm text-text-muted'>
            Review renewals by risk and close window. <span className='font-medium text-text tabular-nums'>{money(atRisk)}</span> ARR is at risk.
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' size='sm' onClick={sortByWindow} aria-pressed={byWindow}>
            <RegistryIcon lucide='CalendarIcon' />
            Soonest first
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setColumns({ ...columns, upcoming: [account(`r${Date.now()}`, mark(Zoom), 'New renewal', 'Clear', 0, 'No date', 100, 'Eli Ramos', 'Enterprise AM', 'men/52', 60), ...columns.upcoming] })}
          >
            <RegistryIcon lucide='PlusIcon' />
            New renewal
          </Button>
        </div>
      </div>
      <Kanban value={columns} onValueChange={(next) => { setColumns(next); setByWindow(false); }} getItemValue={(item) => item.id}>
        <KanbanBoard layout='scroll' aria-label='Renewals risk board'>
          {Object.entries(columns).map(([value, items]) => (
            <StageColumn key={value} value={value} items={items} />
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          {({ value, variant }) => {
            if (variant === 'column') return null;
            const item = all.find((entry) => entry.id === value);
            return item ? <AccountCard item={item} isOverlay /> : null;
          }}
        </KanbanOverlay>
      </Kanban>
    </div>
  );
}
