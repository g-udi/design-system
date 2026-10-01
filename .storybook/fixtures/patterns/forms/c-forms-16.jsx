'use client';
import { Fragment, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../src/components/core/Card/parts/card.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from '../../../../src/components/core/Select/parts/combobox.jsx';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '../../../../src/components/core/Field/parts/field.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../src/components/core/Select/parts/select.jsx';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { FormErrorSummary, useFormValidation, validators } from '../../../../src/components/blocks/Forms/Forms.jsx';

const team = {
  'Maya Chen': 'https://randomuser.me/api/portraits/women/44.jpg',
  'Sam Rivera': 'https://randomuser.me/api/portraits/men/32.jpg',
  'Alex Morgan': 'https://randomuser.me/api/portraits/women/68.jpg',
  'Omar Haddad': 'https://randomuser.me/api/portraits/men/75.jpg',
  'Priya Nair': 'https://randomuser.me/api/portraits/women/12.jpg'
};
const goals = ['Migrate existing content', 'Launch a newsletter', 'Set up paid memberships', 'Connect analytics'];
const rules = {
  company: validators.required('Enter the company name.'),
  website: validators.pattern(/^https?:\/\/\S+\.\S+/, 'Enter a full link starting with https://'),
  industry: validators.required('Choose an industry.'),
  contact: validators.required('Enter the main contact’s name.'),
  email: [validators.required('Enter the main contact’s email.'), validators.email()],
  owners: [validators.required('Assign at least one account owner.'), (owners) => (owners.length > 3 ? 'Assign at most three owners so it is clear who leads.' : '')]
};
const labels = { company: 'Company', website: 'Website', industry: 'Industry', contact: 'Main contact', email: 'Contact email', owners: 'Account owners' };

function Row({ label, htmlFor, description, error, errorId, children }) {
  return (
    <Field orientation='responsive' data-invalid={error ? true : undefined}>
      <FieldContent className='@md/field-group:max-w-52'>
        <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
      <div className='grid min-w-0 gap-1.5 @md/field-group:w-full! @md/field-group:max-w-md'>
        {children}
        {errorId ? <FieldError id={errorId}>{error}</FieldError> : null}
      </div>
    </Field>
  );
}

export function Pattern() {
  const form = useFormValidation({
    initialValues: { company: '', website: '', industry: '', size: '11-50', contact: '', email: '', owners: ['Maya Chen'], goals: ['Migrate existing content'], notes: '' },
    rules
  });
  const [created, setCreated] = useState('');
  const anchor = useComboboxAnchor();
  const { values, errors } = form;

  return (
    <Card className='mx-auto w-full max-w-3xl'>
      <form noValidate aria-labelledby='intake-title' onSubmit={form.handleSubmit((data) => setCreated(`${data.company} is set up. ${data.owners.join(', ')} will get the kickoff checklist.`))} className='flex flex-col gap-(--card-spacing)'>
        <CardHeader>
          <CardTitle id='intake-title'>New customer</CardTitle>
          <CardDescription>Everything the onboarding team needs before the kickoff call.</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-5'>
          <FormErrorSummary form={form} labels={labels} />
          {created ? <p role='status' className='text-success text-sm'>{created}</p> : null}
          <FieldGroup className='gap-5'>
            <Row label='Company' htmlFor={form.id('company')} error={errors.company} errorId={form.errorId('company')}>
              <Input {...form.field('company')} autoComplete='organization' />
            </Row>
            <Row label='Website' htmlFor={form.id('website')} error={errors.website} errorId={form.errorId('website')}>
              <Input {...form.field('website')} type='url' inputMode='url' placeholder='https://' />
            </Row>
            <Row label='Industry' htmlFor={form.id('industry')} error={errors.industry} errorId={form.errorId('industry')}>
              <Select value={values.industry} onValueChange={(industry) => form.setValue('industry', industry)}>
                <SelectTrigger id={form.id('industry')} className='w-full' aria-invalid={errors.industry ? true : undefined} aria-describedby={errors.industry ? form.errorId('industry') : undefined}>
                  <SelectValue placeholder='Choose an industry' />
                </SelectTrigger>
                <SelectContent position='popper'>
                  <SelectItem value='media'>Media and publishing</SelectItem>
                  <SelectItem value='education'>Education</SelectItem>
                  <SelectItem value='software'>Software</SelectItem>
                  <SelectItem value='nonprofit'>Non-profit</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <Row label='Team size' htmlFor={form.id('size')}>
              <ToggleGroup id={form.id('size')} type='single' variant='outline' size='sm' spacing={0} value={values.size} onValueChange={(size) => size && form.setValue('size', size)} aria-label='Team size' className='grid w-full grid-cols-4'>
                {['1-10', '11-50', '51-200', '200+'].map((size) => <ToggleGroupItem key={size} value={size}>{size}</ToggleGroupItem>)}
              </ToggleGroup>
            </Row>
            <FieldSeparator />
            <Row label='Main contact' htmlFor={form.id('contact')} error={errors.contact} errorId={form.errorId('contact')}>
              <Input {...form.field('contact')} autoComplete='name' />
            </Row>
            <Row label='Contact email' htmlFor={form.id('email')} error={errors.email} errorId={form.errorId('email')}>
              <Input {...form.field('email')} type='email' autoComplete='email' />
            </Row>
            <Row label='Account owners' htmlFor={form.id('owners')} description='Up to three people on your side.' error={errors.owners} errorId={form.errorId('owners')}>
              <Combobox multiple autoHighlight items={Object.keys(team)} value={values.owners} onValueChange={(owners) => form.setValue('owners', owners)}>
                <ComboboxChips ref={anchor}>
                  <ComboboxValue>
                    {(selected) => (
                      <Fragment>
                        {selected.map((name) => (
                          <ComboboxChip key={name}>
                            <Avatar className='size-4'>
                              <AvatarImage src={team[name]} alt='' />
                              <AvatarFallback>{name[0]}</AvatarFallback>
                            </Avatar>
                            {name}
                          </ComboboxChip>
                        ))}
                        <ComboboxChipsInput
                          id={form.id('owners')}
                          placeholder={selected.length ? '' : 'Search people'}
                          aria-invalid={errors.owners ? true : undefined}
                          aria-describedby={errors.owners ? form.errorId('owners') : undefined}
                        />
                      </Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty>Nobody found.</ComboboxEmpty>
                  <ComboboxList>
                    {(name) => (
                      <ComboboxItem key={name} value={name}>
                        <Avatar className='size-5'>
                          <AvatarImage src={team[name]} alt='' />
                          <AvatarFallback>{name[0]}</AvatarFallback>
                        </Avatar>
                        {name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Row>
            <FieldSeparator />
            <Row label='Goals' description='What a good first month looks like.'>
              <div role='group' aria-label='Goals' className='grid gap-2'>
                {goals.map((goal, index) => (
                  <Field key={goal} orientation='horizontal'>
                    <Checkbox
                      id={form.id(`goal-${index}`)}
                      checked={values.goals.includes(goal)}
                      onCheckedChange={(on) => form.setValue('goals', on ? [...values.goals, goal] : values.goals.filter((item) => item !== goal))}
                    />
                    <FieldLabel htmlFor={form.id(`goal-${index}`)} className='font-normal'>{goal}</FieldLabel>
                  </Field>
                ))}
              </div>
            </Row>
            <Row label='Notes' htmlFor={form.id('notes')}>
              <Textarea {...form.field('notes')} rows={3} placeholder='Systems they use today, deadlines, anything sensitive.' />
            </Row>
          </FieldGroup>
        </CardContent>
        <CardFooter className='justify-end gap-2 border-t'>
          <Button type='button' variant='ghost' tone='neutral' onClick={() => form.reset()}>Clear</Button>
          <Button type='submit'>Create customer</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
