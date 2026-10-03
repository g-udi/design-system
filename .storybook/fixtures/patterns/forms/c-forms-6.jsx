'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../src/components/core/Card/parts/card.jsx';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../src/components/core/Popover/parts/popover.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../src/components/core/Select/parts/select.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
import { useFormValidation, validators } from '../../../../src/components/blocks/Forms/Forms.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const zones = ['Europe/London', 'Europe/Berlin', 'America/New_York', 'Asia/Singapore'];
const rules = {
  name: validators.required('Enter a display name.'),
  username: [validators.required('Choose a username.'), validators.pattern(/^[a-z0-9_]{3,20}$/, 'Use 3–20 lowercase letters, numbers or underscores.')],
  website: validators.pattern(/^https?:\/\/\S+\.\S+/, 'Enter a full link starting with https://'),
  until: (value, values) => (values.from && value && value <= values.from ? 'End after the start time.' : '')
};
const initialValues = { name: 'Maya Chen', username: 'maya', headline: '', bio: '', website: '', zone: 'Europe/London', date: new Date(2026, 9, 14), from: '10:00', until: '16:00' };
// Fields that count toward completion; the badge updates as they fill in.
const tracked = ['name', 'username', 'headline', 'bio', 'website', 'date'];

function Row({ label, htmlFor, description, error, errorId, children }) {
  return (
    <Field orientation='responsive' data-invalid={error ? true : undefined}>
      <FieldContent className='@md/field-group:max-w-56'>
        <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
      <div className='grid min-w-0 gap-1.5 @md/field-group:w-full! @md/field-group:max-w-md'>
        {children}
        <FieldError id={errorId}>{error}</FieldError>
      </div>
    </Field>
  );
}

export function Pattern() {
  const form = useFormValidation({ initialValues, rules });
  const [saved, setSaved] = useState(initialValues);
  const [dateOpen, setDateOpen] = useState(false);
  const { values, errors } = form;
  const complete = Math.round((tracked.filter((name) => values[name]).length / tracked.length) * 100);
  const dirty = Object.keys(values).some((key) => String(values[key]) !== String(saved[key]));

  return (
    <Card className='mx-auto w-full max-w-3xl'>
      <form noValidate aria-labelledby='profile-card-title' onSubmit={form.handleSubmit((data) => setSaved(data))} className='flex flex-col gap-(--card-spacing)'>
        <CardHeader className='flex flex-wrap items-start justify-between gap-3'>
          <div className='grid gap-1'>
            <CardTitle id='profile-card-title'>Public profile</CardTitle>
            <CardDescription>Shown on your posts and author page.</CardDescription>
          </div>
          <Badge variant={complete === 100 ? 'success-light' : 'warning-light'} aria-live='polite'>
            {complete === 100 ? <RegistryIcon lucide='CircleCheckIcon' aria-hidden='true' /> : null}
            Profile {complete}% complete
          </Badge>
        </CardHeader>
        <CardContent>
          <FieldGroup className='gap-5'>
            <Field orientation='responsive'>
              <FieldContent className='@md/field-group:max-w-56'>
                <FieldLabel>Photo</FieldLabel>
                <FieldDescription>Square, at least 400 px.</FieldDescription>
              </FieldContent>
              <div className='flex items-center gap-3 @md/field-group:w-full! @md/field-group:max-w-md'>
                <Avatar className='size-12'>
                  <AvatarImage src='/avatars/women/44.jpg' alt='' />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <Button type='button' size='sm' variant='outline' tone='neutral'>Change photo</Button>
                <Button type='button' size='sm' variant='ghost' tone='neutral'>Remove</Button>
              </div>
            </Field>
            <FieldSeparator />
            <Row label='Display name' htmlFor={form.id('name')} error={errors.name} errorId={form.errorId('name')}>
              <Input {...form.field('name')} autoComplete='name' />
            </Row>
            <Row label='Username' htmlFor={form.id('username')} description='Your author page address.' error={errors.username} errorId={form.errorId('username')}>
              <Input {...form.field('username')} prefix='gaudi.dev/@' autoComplete='username' />
            </Row>
            <Row label='Headline' htmlFor={form.id('headline')} description='One line under your name.'>
              <Input {...form.field('headline')} placeholder='Engineer writing about local-first software' />
            </Row>
            <Row label='Bio' htmlFor={form.id('bio')}>
              <Textarea {...form.field('bio')} rows={3} placeholder='A few sentences about you and what you write about.' />
            </Row>
            <Row label='Website' htmlFor={form.id('website')} error={errors.website} errorId={form.errorId('website')}>
              <Input {...form.field('website')} type='url' inputMode='url' placeholder='https://' />
            </Row>
            <FieldSeparator />
            <Row label='Office hours' htmlFor={form.id('date')} description='Readers can book a 20-minute call in this window.' error={errors.until} errorId={form.errorId('until')}>
              <div className='grid grid-cols-2 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]'>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button id={form.id('date')} type='button' variant='outline' tone='neutral' className='col-span-2 justify-start font-normal sm:col-span-1'>
                      <RegistryIcon lucide='CalendarIcon' aria-hidden='true' />
                      {values.date ? format(values.date, 'EEE d MMM yyyy') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={values.date}
                      defaultMonth={values.date}
                      onSelect={(date) => {
                        form.setValue('date', date);
                        setDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <Select value={values.from} onValueChange={(from) => form.setValue('from', from)}>
                  <SelectTrigger aria-label='From' className='w-full sm:w-24'><SelectValue /></SelectTrigger>
                  <SelectContent position='popper'>
                    {times.map((time) => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={values.until} onValueChange={(until) => form.setValue('until', until)}>
                  <SelectTrigger aria-label='Until' className='w-full sm:w-24' aria-invalid={errors.until ? true : undefined} aria-describedby={errors.until ? form.errorId('until') : undefined}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {times.map((time) => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </Row>
            <Row label='Time zone' htmlFor={form.id('zone')}>
              <Select value={values.zone} onValueChange={(zone) => form.setValue('zone', zone)}>
                <SelectTrigger id={form.id('zone')} className='w-full'><SelectValue /></SelectTrigger>
                <SelectContent position='popper'>
                  {zones.map((zone) => <SelectItem key={zone} value={zone}>{zone.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </Row>
          </FieldGroup>
        </CardContent>
        <CardFooter className='justify-end gap-2 border-t'>
          <span role='status' className='text-text-muted me-auto text-sm'>{dirty ? 'Unsaved changes' : 'All changes saved'}</span>
          <Button type='button' variant='ghost' tone='neutral' disabled={!dirty} onClick={() => form.reset(saved)}>Discard</Button>
          <Button type='submit' disabled={!dirty}>Save profile</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
