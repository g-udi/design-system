'use client';
import { TableRoot as Table, TableHeader, TableBodyPrimitive as TableBody, TableFooter, TableRowPrimitive as TableRow, TableHeadPrimitive as TableHead, TableCellPrimitive as TableCell, TableCaption } from '@gaudi/design-system/mdx/Table';
import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { DashboardGrid, DashboardPanel, dashboardSpan } from '@gaudi/design-system/blocks/Dashboard';
import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { default as BreadcrumbTrail } from '@gaudi/design-system/core/Breadcrumb';
import { AvatarGroup } from '@gaudi/design-system/core/Avatar';
import { default as Avatar } from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ProgressRing } from '@gaudi/design-system/core/Progress';
import { Badge } from '@gaudi/design-system/core/Pill';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const firstMonday = new Date(2026, 8, 28);
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const people = [
  { id: 'maya', name: 'Maya Lopez', role: 'Design lead', avatar: '/avatars/person-23.svg', capacity: 40 },
  { id: 'omar', name: 'Kerem Haddadin', role: 'Engineer', avatar: '/avatars/person-41.svg', capacity: 40 },
  { id: 'priya', name: 'Priyanka Nairn', role: 'Engineer', avatar: '/avatars/person-14.svg', capacity: 32 },
  { id: 'tom', name: 'Tom Becker', role: 'Writer', avatar: '/avatars/person-43.svg', capacity: 24 },
  { id: 'li', name: 'Li Wei', role: 'Data', avatar: '/avatars/person-50.svg', capacity: 40 }
];
// Hours per person per day for three weeks; week 0 starts on Monday 28 September 2026.
const weeks = [
  { maya: [8, 7.5, 8, 8, 6, 0, 0], omar: [8, 8, 9, 8.5, 7, 2, 0], priya: [6, 6.5, 6, 7, 6, 0, 0], tom: [4, 5, 4, 5, 3, 0, 0], li: [8, 8, 7, 8, 8, 0, 0] },
  { maya: [8, 8, 8, 7, 8, 0, 0], omar: [9, 9, 8.5, 9, 8, 3, 1], priya: [6.5, 6, 7, 6, 6.5, 0, 0], tom: [5, 5, 5, 4, 5, 0, 0], li: [7.5, 8, 8, 8, 7, 0, 0] },
  { maya: [7, 8, 8, 8, 7, 0, 0], omar: [8, 8, 8, 8, 8, 0, 0], priya: [6, 6, 6, 6, 6, 0, 0], tom: [6, 6, 4, 6, 2, 0, 0], li: [8, 8, 8, 6, 8, 0, 0] }
];
const sum = (values) => values.reduce((total, value) => total + value, 0);
const hours = (value) => (value ? `${value}` : '–');

function Person({ person }) {
  return (
    <span className='flex min-w-40 items-center gap-2'>
      <Avatar src={person.avatar} name={person.name} alt='' size='sm' />
      <span className='grid leading-tight'>
        <span className='font-medium'>{person.name}</span>
        <span className='text-text-muted text-xs'>{person.role}</span>
      </span>
    </span>
  );
}

export function Pattern() {
  const [week, setWeek] = useState(0);
  const start = addDays(firstMonday, week * 7);
  const log = weeks[week];
  const total = sum(people.map((person) => sum(log[person.id])));
  const capacity = sum(people.map((person) => person.capacity));
  const overtime = sum(people.map((person) => Math.max(0, sum(log[person.id]) - person.capacity)));
  const range = `${format(start, 'MMM d')} – ${format(addDays(start, 6), 'MMM d, y')}`;
  return (
    <div className='grid w-full gap-4'>
      <header className='grid gap-3'>
        <BreadcrumbTrail items={[{ label: 'Gaudi', href: '#workspace' }, { label: 'Projects', href: '#projects' }, { label: 'Reader app 2.0' }]} />
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='grid gap-1'>
            <h2 className='flex items-center gap-2 text-xl font-semibold'>Reader app 2.0 <Badge variant='success-light'>On track</Badge></h2>
            <p className='text-text-muted text-sm'>Beta ships October 23 · 5 people · 62% of scope done</p>
          </div>
          <div className='flex items-center gap-3'>
            <AvatarGroup avatars={people.map((person) => ({ id: person.id, src: person.avatar, name: person.name }))} max={4} label='Project collaborators' />
            <Button variant='outline' tone='neutral' size='sm'><RegistryIcon lucide='PlusIcon' aria-hidden='true' />Invite</Button>
          </div>
        </div>
      </header>
      <Tabs defaultValue='timesheet' className='gap-4'>
        <TabsList aria-label='Project views'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='timesheet'>Timesheet</TabsTrigger>
          <TabsTrigger value='files'>Files</TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>
          <p className='text-text-muted text-sm'>Milestones, risks and the delivery plan live here; open the timesheet for this week’s hours.</p>
        </TabsContent>
        <TabsContent value='files'>
          <p className='text-text-muted text-sm'>Specs, designs and release notes shared with the project.</p>
        </TabsContent>
        <TabsContent value='timesheet'>
          <DashboardGrid label='Timesheet'>
            <StatCard label='Logged' value={`${total} h`} description={`of ${capacity} h capacity`} className={dashboardSpan(4, 2)} />
            <StatCard label='Utilisation' value={`${Math.round((total / capacity) * 100)}%`} description='Logged against capacity' className={dashboardSpan(4, 2)} />
            <StatCard label='Overtime' value={`${overtime} h`} description='Above each person’s week' className={dashboardSpan(4, 2)} />
            <DashboardPanel
              span={12}
              title='Worklog'
              action={
                <div className='flex items-center gap-1'>
                  <Button variant='ghost' tone='neutral' size='icon-sm' aria-label='Previous week' disabled={week === 0} onClick={() => setWeek(week - 1)}><RegistryIcon lucide='ChevronLeftIcon' /></Button>
                  <span aria-live='polite' className='min-w-36 text-center text-sm tabular-nums'>{range}</span>
                  <Button variant='ghost' tone='neutral' size='icon-sm' aria-label='Next week' disabled={week === weeks.length - 1} onClick={() => setWeek(week + 1)}><RegistryIcon lucide='ChevronRightIcon' /></Button>
                </div>
              }
            >
              <Table className='min-w-[44rem]' containerProps={{ role: 'region', 'aria-label': 'Hours logged per person and day', tabIndex: 0 }}>
                <TableCaption className='sr-only'>Hours logged per person and day, {range}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead scope='col' className='text-start'>Person</TableHead>
                    {days.map((day, index) => (
                      <TableHead key={day} scope='col' className='text-end tabular-nums'>
                        {day} <span className='block font-normal'>{format(addDays(start, index), 'd')}</span>
                      </TableHead>
                    ))}
                    <TableHead scope='col' className='text-end'>Total</TableHead>
                    <TableHead scope='col' className='text-end'>Capacity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {people.map((person) => {
                    const logged = sum(log[person.id]);
                    return (
                      <TableRow key={person.id} >
                        <TableCell as='th' scope='row' className='text-start font-normal'><Person person={person} /></TableCell>
                        {log[person.id].map((value, index) => (
                          <TableCell key={days[index]} className={`text-end tabular-nums ${index > 4 ? 'text-text-muted' : ''}`}>{hours(value)}</TableCell>
                        ))}
                        <TableCell className='text-end font-medium tabular-nums'>{logged}</TableCell>
                        <TableCell>
                          <span className='flex items-center justify-end gap-2'>
                            <ProgressRing value={logged} max={person.capacity} size='sm' tone={logged > person.capacity ? 'warning' : 'accent'} label={`${person.name}, ${logged} of ${person.capacity} hours`} />
                            <span className='text-text-muted text-xs tabular-nums'>/{person.capacity}</span>
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow className='font-medium'>
                    <TableCell as='th' scope='row' className='text-start'>Team</TableCell>
                    {days.map((day, index) => <TableCell key={day} className='text-end tabular-nums'>{hours(sum(people.map((person) => log[person.id][index])))}</TableCell>)}
                    <TableCell className='text-end tabular-nums'>{total}</TableCell>
                    <TableCell className='text-text-muted text-end text-xs tabular-nums'>{capacity} h</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </DashboardPanel>
          </DashboardGrid>
        </TabsContent>
      </Tabs>
    </div>
  );
}
