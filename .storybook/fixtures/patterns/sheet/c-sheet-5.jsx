'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../../../../src/components/core/Sheet/parts/sheet.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const toggles = [
  ['reading-time', 'Show reading time', 'On every article card and page.', true],
  ['comments', 'Open comments', 'Readers can reply under articles.', true],
  ['digest', 'Weekly digest', 'Send a summary to subscribers every Monday.', false]
];
const layouts = [
  ['grid', 'Grid', 'LayoutGridIcon'],
  ['columns', 'Columns', 'Columns3Icon'],
  ['list', 'List', 'MenuIcon']
];

// Two sections scroll between a fixed header and a footer that stays in view.
export function Pattern() {
  const [layout, setLayout] = useState('grid');
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='sm' variant='outline'>
          <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
          Site settings
        </Button>
      </SheetTrigger>
      <SheetContent size='md' className='gap-0'>
        <SheetHeader className='border-b'>
          <SheetTitle>Site settings</SheetTitle>
          <SheetDescription>Your public profile and how the site behaves for readers.</SheetDescription>
        </SheetHeader>
        <div className='grid min-h-0 flex-1 gap-6 overflow-y-auto p-3'>
          <FieldSet>
            <FieldLegend>Profile</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='settings-name'>Site name</FieldLabel>
                <Input id='settings-name' defaultValue='Gaudi Journal' />
              </Field>
              <Field>
                <FieldLabel htmlFor='settings-email'>Contact email</FieldLabel>
                <Input id='settings-email' type='email' defaultValue='hello@gaudi.dev' />
                <FieldDescription>Shown on the about page and in newsletter footers.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Reading</FieldLegend>
            <FieldGroup className='gap-4'>
              {toggles.map(([id, label, hint, on]) => (
                <Field key={id} orientation='horizontal' className='items-start justify-between'>
                  <div className='grid gap-0.5'>
                    <FieldLabel htmlFor={`settings-${id}`}>{label}</FieldLabel>
                    <FieldDescription>{hint}</FieldDescription>
                  </div>
                  <Switch id={`settings-${id}`} defaultChecked={on} />
                </Field>
              ))}
              <Field>
                <FieldLabel id='settings-layout'>Home page layout</FieldLabel>
                <ToggleGroup aria-labelledby='settings-layout' type='single' variant='outline' spacing={2} value={layout} onValueChange={(next) => setLayout(next || layout)} className='grid w-full grid-cols-3'>
                  {layouts.map(([value, label, icon]) => (
                    <ToggleGroupItem key={value} value={value} className='h-16 flex-col gap-1'>
                      <RegistryIcon lucide={icon} aria-hidden='true' />
                      {label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>
        <SheetFooter className='flex-row justify-end border-t'>
          <SheetClose asChild>
            <Button variant='outline'>Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Save settings</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
