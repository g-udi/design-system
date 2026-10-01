'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import { Card, CardContent, CardFooter } from '../../../../src/components/core/Card/parts/card.jsx';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../src/components/core/Popover/parts/popover.jsx';
import { default as RadioGroup } from '../../../../src/components/core/RadioGroup/index.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../src/components/core/Select/parts/select.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { FormErrorSummary, useFormValidation, validators } from '../../../../src/components/blocks/Forms/Forms.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const platforms = [
  { value: 'web', label: 'Web', icon: 'GlobeIcon' },
  { value: 'ios', label: 'iOS', icon: 'SmartphoneIcon' },
  { value: 'android', label: 'Android', icon: 'SmartphoneIcon' }
];
const regions = { eu: 'Europe (Frankfurt)', uk: 'United Kingdom (London)', us: 'United States (Virginia)', ap: 'Asia Pacific (Singapore)' };
const plans = [
  { value: 'hobby', label: 'Hobby', description: 'Free · 1 GB' },
  { value: 'pro', label: 'Pro', description: '£20/month · 50 GB' },
  { value: 'scale', label: 'Scale', description: '£90/month · 500 GB' }
];
const slugify = (value) => String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32);
const taken = ['notes', 'field-notes', 'gaudi'];
const rules = {
  name: [validators.required('Name the app.'), validators.maxLength(40)],
  slug: [
    validators.required('Choose an address.'),
    validators.pattern(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single dashes.'),
    (slug) => (taken.includes(slug) ? `${slug}.gaudi.app is taken. Try another.` : '')
  ],
  platforms: validators.required('Pick at least one platform.')
};

export function Pattern() {
  const form = useFormValidation({
    initialValues: { name: 'Field Notes', slug: 'field-notes', slugEdited: false, platforms: ['web', 'ios'], region: 'eu', plan: 'pro', channel: 'beta', date: new Date(2026, 10, 3), announce: true },
    rules
  });
  const [dateOpen, setDateOpen] = useState(false);
  const [launched, setLaunched] = useState(false);
  const { values, errors } = form;
  const plan = plans.find((item) => item.value === values.plan);

  return (
    <Card className='mx-auto w-full max-w-3xl overflow-hidden pt-0'>
      <form noValidate aria-labelledby='launch-title' onSubmit={form.handleSubmit(() => setLaunched(true))} className='flex flex-col gap-(--card-spacing)'>
        <div aria-live='polite' className='from-accent-subtle via-discovery/15 to-attention/15 grid gap-3 border-b bg-linear-to-br p-5 sm:p-6'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant={values.channel === 'beta' ? 'attention' : 'success'} size='sm'>{values.channel === 'beta' ? 'Beta' : 'Stable'}</Badge>
            <Badge variant='secondary' size='sm'>{plan.label}</Badge>
            {launched ? <Badge variant='success-light' size='sm'>Scheduled</Badge> : null}
          </div>
          <div className='grid gap-1'>
            <h2 id='launch-title' className='text-xl font-semibold'>{values.name || 'Untitled app'}</h2>
            <p className='text-text-muted font-mono text-sm break-all'>{values.slug || 'your-app'}.gaudi.app</p>
          </div>
          <dl className='flex flex-wrap gap-x-6 gap-y-1 text-sm'>
            <div className='flex gap-1.5'><dt className='text-text-muted'>Platforms</dt><dd>{values.platforms.length ? values.platforms.map((value) => platforms.find((item) => item.value === value).label).join(', ') : 'None'}</dd></div>
            <div className='flex gap-1.5'><dt className='text-text-muted'>Region</dt><dd>{regions[values.region]}</dd></div>
            <div className='flex gap-1.5'><dt className='text-text-muted'>Launch</dt><dd>{format(values.date, 'EEE d MMM')}</dd></div>
          </dl>
        </div>
        <CardContent className='grid gap-5 pt-2'>
          <FormErrorSummary form={form} labels={{ name: 'App name', slug: 'Address', platforms: 'Platforms' }} />
          <FieldGroup className='gap-5'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Field data-invalid={errors.name ? true : undefined}>
                <FieldLabel htmlFor={form.id('name')}>App name</FieldLabel>
                <Input
                  {...form.field('name')}
                  onChange={(event) => {
                    const name = event.target.value;
                    form.setValues((current) => ({ ...current, name, slug: current.slugEdited ? current.slug : slugify(name) }));
                  }}
                />
                <FieldError id={form.errorId('name')}>{errors.name}</FieldError>
              </Field>
              <Field data-invalid={errors.slug ? true : undefined}>
                <FieldLabel htmlFor={form.id('slug')}>Address</FieldLabel>
                <Input
                  {...form.field('slug')}
                  suffix='.gaudi.app'
                  onChange={(event) => form.setValues((current) => ({ ...current, slug: event.target.value.toLowerCase(), slugEdited: true }))}
                  inputClassName='font-mono'
                />
                <FieldError id={form.errorId('slug')}>{errors.slug}</FieldError>
              </Field>
            </div>
            <FieldSet aria-describedby={errors.platforms ? form.errorId('platforms') : undefined}>
              <FieldLegend variant='label' id={form.id('platforms-label')}>Platforms</FieldLegend>
              <ToggleGroup id={form.id('platforms')} type='multiple' variant='outline' value={values.platforms} onValueChange={(next) => form.setValue('platforms', next)} aria-labelledby={form.id('platforms-label')} className='flex flex-wrap justify-start'>
                {platforms.map((platform) => (
                  <ToggleGroupItem key={platform.value} value={platform.value}>
                    <RegistryIcon lucide={platform.icon} aria-hidden='true' />
                    {platform.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <FieldError id={form.errorId('platforms')}>{errors.platforms}</FieldError>
            </FieldSet>
            <RadioGroup label='Plan' variant='cards' value={values.plan} onValueChange={(value) => form.setValue('plan', value)} options={plans} />
            <div className='grid gap-4 sm:grid-cols-3'>
              <Field>
                <FieldLabel htmlFor={form.id('region')}>Region</FieldLabel>
                <Select value={values.region} onValueChange={(region) => form.setValue('region', region)}>
                  <SelectTrigger id={form.id('region')} className='w-full'><SelectValue /></SelectTrigger>
                  <SelectContent position='popper'>
                    {Object.entries(regions).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor={form.id('channel')}>Release channel</FieldLabel>
                <Select value={values.channel} onValueChange={(channel) => form.setValue('channel', channel)}>
                  <SelectTrigger id={form.id('channel')} className='w-full'><SelectValue /></SelectTrigger>
                  <SelectContent position='popper'>
                    <SelectItem value='beta'>Beta</SelectItem>
                    <SelectItem value='stable'>Stable</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor={form.id('date')}>Launch date</FieldLabel>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button id={form.id('date')} type='button' variant='outline' tone='neutral' className='justify-start font-normal'>
                      <RegistryIcon lucide='CalendarIcon' aria-hidden='true' />
                      {format(values.date, 'd MMM yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      required
                      selected={values.date}
                      defaultMonth={values.date}
                      disabled={{ before: new Date(2026, 9, 2) }}
                      onSelect={(date) => {
                        form.setValue('date', date);
                        setDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            </div>
            <Field orientation='horizontal'>
              <FieldContent>
                <FieldLabel htmlFor={form.id('announce')}>Announce to followers</FieldLabel>
                <FieldDescription>Post the launch to your newsletter and changelog on the day.</FieldDescription>
              </FieldContent>
              <Switch id={form.id('announce')} checked={values.announce} onCheckedChange={(announce) => form.setValue('announce', announce)} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className='justify-end gap-2 border-t'>
          {launched ? <p role='status' className='text-success me-auto text-sm'>Launch scheduled for {format(values.date, 'd MMMM')}.</p> : null}
          <Button type='submit'>
            <RegistryIcon lucide='RocketIcon' aria-hidden='true' />
            {launched ? 'Update launch' : 'Schedule launch'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
