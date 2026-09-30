'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../../../src/components/core/Tabs/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const panels = [
  {
    value: 'account',
    label: 'Account',
    icon: 'UserIcon',
    description: 'Update your account information.',
    fields: [['Name', 'text', 'Sarah Johnson'], ['Email', 'email', 'sarah@example.com']],
    action: 'Save changes'
  },
  {
    value: 'password',
    label: 'Password',
    icon: 'LockIcon',
    description: 'Change your password here.',
    fields: [['Current password', 'password'], ['New password', 'password']],
    action: 'Update password'
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: 'SettingsIcon',
    description: 'Manage your preferences.',
    fields: [['Theme', 'text', 'Light'], ['Language', 'text', 'English']],
    action: 'Save settings'
  }
];
const options = [
  { key: 'line', label: 'Line' },
  { key: 'vertical', label: 'Vertical' },
  { key: 'icons', label: 'Icons' },
  { key: 'fullWidth', label: 'Full width' }
];
export function Pattern() {
  const [layout, setLayout] = useState({ line: false, vertical: false, icons: true, fullWidth: false });
  const vertical = layout.vertical;
  return (
    <div className='mx-auto grid w-full max-w-lg gap-3'>
      <div role='group' aria-label='Tab options' className='flex flex-wrap gap-x-4 gap-y-2'>
        {options.map((option) => (
          <Label key={option.key} className='gap-2 text-sm font-normal'>
            <Switch
              size='sm'
              checked={layout[option.key]}
              onCheckedChange={(checked) => setLayout((current) => ({ ...current, [option.key]: checked }))}
            />
            {option.label}
          </Label>
        ))}
      </div>
      <Tabs key={vertical ? 'vertical' : 'horizontal'} defaultValue='account' orientation={vertical ? 'vertical' : 'horizontal'} className='gap-3'>
        <TabsList
          variant={layout.line ? 'line' : undefined}
          className={vertical ? 'w-36 shrink-0' : undefined}
        >
          {panels.map((panel) => (
            <TabsTrigger key={panel.value} value={panel.value} className={vertical ? 'justify-start gap-2' : layout.fullWidth ? 'flex-1 gap-2' : 'gap-2'}>
              {layout.icons ? <RegistryIcon lucide={panel.icon} className='size-4' aria-hidden='true' /> : null}
              {panel.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {panels.map((panel) => (
          <TabsContent key={panel.value} value={panel.value} className='min-w-0 flex-1'>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>{panel.label}</CardTitle>
                <CardDescription className='text-sm'>{panel.description}</CardDescription>
              </CardHeader>
              <CardContent className='grid gap-3'>
                {panel.fields.map(([name, type, value]) => {
                  const id = `tabs-${panel.value}-${name.toLowerCase().replace(/\s/g, '-')}`;
                  return (
                    <div key={name} className='grid gap-1.5'>
                      <Label htmlFor={id} className='text-sm'>{name}</Label>
                      <Input id={id} type={type} defaultValue={value} className='h-8' />
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className='pt-3'>
                <Button size='sm'>{panel.action}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
