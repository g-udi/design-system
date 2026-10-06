'use client';
import { EmailInput } from '@gaudi/design-system/core/Input';
import { useId, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
import { Label } from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@gaudi/design-system/core/Tabs';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const panels = [
  {
    value: 'account',
    label: 'Account',
    icon: 'UserIcon',
    description: 'Update your account information.',
    fields: [['Name', 'text', 'Sabine Johansson'], ['Email', 'email', 'sabine@example.com']],
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
  { key: 'outline', label: 'Outline' },
  { key: 'vertical', label: 'Vertical' },
  { key: 'icons', label: 'Icons' },
  { key: 'fullWidth', label: 'Full width' }
];
export function Pattern() {
  const [layout, setLayout] = useState({ outline: false, vertical: false, icons: true, fullWidth: false });
  const vertical = layout.vertical;
  const idPrefix = useId();
  const [savedPanel, setSavedPanel] = useState(null);
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
          variant={layout.outline ? 'outline' : 'underline'}
          className={vertical ? 'w-24 shrink-0 sm:w-36' : undefined}
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
            <form onSubmit={(event) => { event.preventDefault(); setSavedPanel(panel.value); }}>
              <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>{panel.label}</CardTitle>
                <CardDescription className='text-sm'>{panel.description}</CardDescription>
              </CardHeader>
              <CardContent className='grid gap-3'>
                {panel.fields.map(([name, type, value]) => {
                  const id = `${idPrefix}-${panel.value}-${name.toLowerCase().replace(/\s/g, '-')}`;
                  const Control = type === 'email' ? EmailInput : Input;
                  return (
                    <div key={name} className='grid gap-1.5'>
                      <Label htmlFor={id} className='text-sm'>{name}</Label>
                      <Control id={id} {...(type === 'email' ? {} : { type })} defaultValue={value} className='h-8' />
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className='flex-wrap gap-2 pt-3'>
                <Button type='submit' size='sm'>{panel.action}</Button>
                {savedPanel === panel.value ? <p role='status' className='text-xs text-text-muted'>{panel.label} saved.</p> : null}
              </CardFooter>
              </Card>
              </form>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
