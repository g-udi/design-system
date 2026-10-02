'use client';
import { useState } from 'react';
import { default as AppShell } from '../../../../src/components/blocks/AppShell/index.js';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuTrigger } from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../src/components/core/Popover/parts/popover.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const teams = ['Editorial', 'Growth', 'Platform'];
const projects = { Editorial: ['Friday issue', 'Archive', 'Podcast'], Growth: ['Referrals', 'Onboarding'], Platform: ['Reader app', 'Search'] };
const routes = [
  { group: 'Plan', items: [{ id: 'roadmap', label: 'Roadmap', icon: 'MapPin' }, { id: 'issues', label: 'Issues', icon: 'CircleDot', count: 18 }, { id: 'cycles', label: 'Cycles', icon: 'RefreshCw' }] },
  { group: 'Ship', items: [{ id: 'releases', label: 'Releases', icon: 'Rocket' }, { id: 'docs', label: 'Docs', icon: 'FileText' }] }
];
const apps = [['Write', 'PenTool'], ['Analytics', 'BarChart3'], ['Mail', 'Mail'], ['Calendar', 'CalendarDays'], ['Files', 'Folder'], ['Assistant', 'Sparkles'], ['Forms', 'ClipboardList'], ['Automations', 'Workflow'], ['Settings', 'Settings']];
const issues = [
  { id: 'GAU-214', title: 'Archive search returns duplicates', owner: 'women/44', state: 'In progress', tone: 'info-light' },
  { id: 'GAU-209', title: 'Podcast feed misses episode art', owner: 'men/32', state: 'Todo', tone: 'secondary' },
  { id: 'GAU-201', title: 'Friday issue preview is cut off on phones', owner: 'women/68', state: 'In review', tone: 'warning-light' }
];

function Switcher({ label, value, options, onChange }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='sm' variant='ghost' tone='neutral' aria-label={`${label}: ${value}`}>
          <span className='max-w-32 truncate'>{value}</span>
          <RegistryIcon lucide='ChevronsUpDown' className='size-3.5' aria-hidden='true' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => <DropdownMenuRadioItem key={option} value={option}>{option}</DropdownMenuRadioItem>)}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem><RegistryIcon lucide='Plus' className='size-4' aria-hidden='true' />New {label.toLowerCase()}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Pattern() {
  const [team, setTeam] = useState('Editorial');
  const [project, setProject] = useState('Archive');
  const [active, setActive] = useState('issues');
  const [selected, setSelected] = useState(issues[0].id);
  const issue = issues.find((entry) => entry.id === selected);

  return (
    <div className='h-[44rem] w-full overflow-hidden rounded-(--ds-radius-card) border'>
      <AppShell
        className='h-full min-h-0 [&_.ds-app-workspace]:min-h-0 [&_.ds-app-body]:min-h-0 [&_.ds-app-body]:overflow-y-auto [&_.ds-app-rail]:overflow-y-auto'
        brand={<span className='flex items-center gap-2'><RegistryIcon lucide='Layers' className='text-accent size-5' aria-hidden='true' />Gaudi</span>}
        navigationLabel='Project navigation'
        navigation={
          <div className='grid gap-4'>
            {routes.map(({ group, items }) => (
              <div key={group}>
                <p className='text-text-muted px-2 pb-1 text-xs font-medium'>{group}</p>
                <ul className='grid gap-0.5 border-s ps-2 ms-2'>
                  {items.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} aria-current={active === item.id ? 'page' : undefined} onClick={(event) => { event.preventDefault(); setActive(item.id); }} className='hover:bg-surface aria-[current=page]:bg-surface aria-[current=page]:text-accent flex items-center gap-2 rounded-(--ds-radius-control) px-2 py-1.5 text-sm'>
                        <RegistryIcon lucide={item.icon} className='size-4' aria-hidden='true' />
                        <span className='flex-1'>{item.label}</span>
                        {item.count ? <Badge variant='secondary'>{item.count}</Badge> : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        }
        footer={<p className='text-text-muted px-2 text-xs'>{team} · {project}</p>}
        header={
          <>
            <Switcher label='Team' value={team} options={teams} onChange={(next) => { setTeam(next); setProject(projects[next][0]); }} />
            <span aria-hidden='true' className='text-text-muted'>/</span>
            <Switcher label='Project' value={project} options={projects[team]} onChange={setProject} />
            <span className='flex-1' />
            <Popover>
              <PopoverTrigger asChild>
                <Button size='icon-sm' variant='ghost' tone='neutral' aria-label='Gaudi apps'><RegistryIcon lucide='LayoutGrid' className='size-4' aria-hidden='true' /></Button>
              </PopoverTrigger>
              <PopoverContent align='end' className='w-72 p-2'>
                <ul className='grid grid-cols-3 gap-1' aria-label='Gaudi apps'>
                  {apps.map(([label, icon]) => (
                    <li key={label}><a href={`#${label.toLowerCase()}`} className='hover:bg-surface-muted grid justify-items-center gap-1.5 rounded-(--ds-radius-control) p-3 text-xs'><RegistryIcon lucide={icon} className='text-accent size-5' aria-hidden='true' />{label}</a></li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            <Avatar className='size-8'><AvatarImage src='https://randomuser.me/api/portraits/women/65.jpg' alt='Maya Lopez' /><AvatarFallback>ML</AvatarFallback></Avatar>
          </>
        }
        asideLabel='Issue details'
        aside={
          <div className='grid gap-3 text-sm'>
            <p className='text-text-muted text-xs'>{issue.id}</p>
            <h2 className='font-semibold'>{issue.title}</h2>
            <Badge variant={issue.tone} className='justify-self-start'>{issue.state}</Badge>
            <dl className='grid gap-2'>
              <div className='flex justify-between'><dt className='text-text-muted'>Project</dt><dd>{project}</dd></div>
              <div className='flex justify-between'><dt className='text-text-muted'>Cycle</dt><dd>Cycle 41</dd></div>
            </dl>
            <Progress value={62} aria-label='Cycle progress' />
          </div>
        }
        statusBar={
          <>
            <span className='flex items-center gap-1.5'><span aria-hidden='true' className='bg-success size-2 rounded-full' />Synced</span>
            <span>Cycle 41 · 62% done</span>
            <span className='ms-auto'>3 people viewing</span>
          </>
        }
      >
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h1 className='text-xl font-semibold'>Issues</h1>
            <p className='text-text-muted text-sm'>{project} · 18 open</p>
          </div>
          <Button size='sm'><RegistryIcon lucide='Plus' className='size-4' aria-hidden='true' />New issue</Button>
        </div>
        <ul className='mt-4 divide-y rounded-(--ds-radius-card) border' aria-label='Issues'>
          {issues.map((entry) => (
            <li key={entry.id}>
              <button type='button' aria-current={entry.id === selected ? 'true' : undefined} onClick={() => setSelected(entry.id)} className='hover:bg-surface-muted aria-[current=true]:bg-accent-subtle flex w-full items-center gap-3 px-4 py-3 text-start text-sm'>
                <code className='text-text-muted text-xs'>{entry.id}</code>
                <span className='min-w-0 flex-1 truncate'>{entry.title}</span>
                <Badge variant={entry.tone} className='hidden sm:inline-flex'>{entry.state}</Badge>
                <Avatar className='size-6'><AvatarImage src={`https://randomuser.me/api/portraits/${entry.owner}.jpg`} alt='' /><AvatarFallback>?</AvatarFallback></Avatar>
              </button>
            </li>
          ))}
        </ul>
      </AppShell>
    </div>
  );
}
