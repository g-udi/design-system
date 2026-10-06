'use client';
import { TableRoot as Table, TableHeader, TableBodyPrimitive as TableBody, TableRowPrimitive as TableRow, TableHeadPrimitive as TableHead, TableCellPrimitive as TableCell, TableCaption } from '@gaudi/design-system/mdx/Table';
import { useState } from 'react';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@gaudi/design-system/core/Accordion';
import {
  FieldRoot as Field,
  FieldContent,
  FieldDescriptionPrimitive as FieldDescription,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import { Label } from '@gaudi/design-system/core/Field';
import {
  NativeSelect,
  NativeSelectOption
} from '@gaudi/design-system/core/Select';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@gaudi/design-system/core/Tabs';
import {
  ToggleGroupRoot as ToggleGroup,
  ToggleGroupItem
} from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const channels = [
  { id: 'email', label: 'Email', icon: 'MailIcon', defaults: ['mentions', 'assigned', 'billing'] },
  { id: 'slack', label: 'Slack', icon: 'HashIcon', defaults: ['mentions', 'assigned', 'deploys'] },
  { id: 'app', label: 'In-app', icon: 'BellIcon', defaults: ['mentions', 'assigned', 'comments', 'deploys', 'billing'] }
];
// Each event is a row and each column a scope; the matrix is per channel.
const events = [
  ['mentions', 'Mentions'],
  ['assigned', 'Assigned to me'],
  ['comments', 'New comments'],
  ['deploys', 'Deploys'],
  ['billing', 'Billing']
];
const scopes = [['mine', 'My work'], ['team', 'My teams'], ['all', 'Everything']];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Row({ id, label, description, children }) {
  return (
    <Field orientation='horizontal'>
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
      {children}
    </Field>
  );
}

export function Pattern() {
  const [digest, setDigest] = useState(true);
  return (
    <div className='grid w-full max-w-3xl gap-4'>
      <section aria-labelledby='digest-title' className='grid gap-4 rounded-xl border p-5'>
        <h2 id='digest-title' className='text-lg font-semibold'>Daily digest</h2>
        <Row id='digest' label='Send a digest' description='One email with everything you missed.'>
          <Switch id='digest' checked={digest} onCheckedChange={setDigest} />
        </Row>
        {digest ? (
          <div className='flex flex-wrap items-center gap-3'>
            <ToggleGroup aria-label='Digest days' type='multiple' variant='outline' size='sm' spacing={0} defaultValue={days.slice(0, 5)}>
              {days.map((day) => (
                <ToggleGroupItem key={day} value={day}>{day}</ToggleGroupItem>
              ))}
            </ToggleGroup>
            <NativeSelect aria-label='Digest time' size='sm' defaultValue='08:00' className='w-28'>
              {['07:00', '08:00', '12:00', '18:00'].map((time) => (
                <NativeSelectOption key={time} value={time}>{time}</NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        ) : null}
      </section>
      <Tabs defaultValue='email' className='grid gap-4 rounded-xl border p-5'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 className='text-lg font-semibold'>Alerts by channel</h2>
          <TabsList aria-label='Channel'>
            {channels.map((channel) => (
              <TabsTrigger key={channel.id} value={channel.id}>
                <RegistryIcon lucide={channel.icon} aria-hidden='true' />
                {channel.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {channels.map((channel) => (
          <TabsContent key={channel.id} value={channel.id} className='grid gap-4'>
            <Row id={`${channel.id}-mode`} label='Delivery' description={`How ${channel.label} alerts arrive.`}>
              <NativeSelect id={`${channel.id}-mode`} size='sm' defaultValue='instant' className='w-36'>
                <NativeSelectOption value='instant'>Instantly</NativeSelectOption>
                <NativeSelectOption value='hourly'>Hourly batch</NativeSelectOption>
                <NativeSelectOption value='off'>Off</NativeSelectOption>
              </NativeSelect>
            </Row>
            <Table containerProps={{ role: 'region', 'aria-label': `${channel.label} alerts by scope`, tabIndex: 0 }} className='min-w-[28rem]'>
              <TableCaption className='sr-only'>{channel.label} alerts by scope</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead scope='col' className='text-left'>Event</TableHead>
                  {scopes.map(([key, label]) => (
                    <TableHead scope='col' key={key} className='text-center'>{label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map(([key, label]) => (
                  <TableRow key={key}>
                    <TableCell as='th' scope='row' className='text-left font-normal'>{label}</TableCell>
                    {scopes.map(([scope, scopeLabel]) => (
                      <TableCell key={scope} className='text-center'>
                        <Checkbox aria-label={`${label}, ${scopeLabel}`} defaultChecked={scope === 'mine' && channel.defaults.includes(key)} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
      <Collapsible className='rounded-xl border'>
        <CollapsibleTrigger className='group flex w-full cursor-pointer items-center gap-3 p-4 text-left'>
          <span className='grid flex-1 gap-0.5'>
            <span className='font-medium'>Auto-follow</span>
            <span className='text-text-muted text-sm'>Threads you join automatically.</span>
          </span>
          <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' className='text-text-muted size-4 transition-transform group-data-[state=closed]:-rotate-90' />
        </CollapsibleTrigger>
        <CollapsibleContent className='grid gap-3 border-t p-4'>
          {[['follow-created', 'Documents I create', true], ['follow-commented', 'Threads I comment on', true], ['follow-assigned', 'Tasks assigned to my team', false]].map(([id, label, on]) => (
            <div key={id} className='flex items-center justify-between gap-3'>
              <Label htmlFor={id} className='font-normal'>{label}</Label>
              <Switch id={id} size='sm' defaultChecked={on} />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
