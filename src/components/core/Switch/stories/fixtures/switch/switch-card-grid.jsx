'use client';
import { useId } from 'react';
import {
  FieldRoot as Field,
  FieldContent,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel,
  FieldTitle
} from '@gaudi/design-system/core/Field';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const features = [
  {
    id: 'feat-analytics',
    title: 'Analytics',
    description: 'Count reads and scroll depth without cookies',
    checked: true,
    icon: (
      <RegistryIcon
        lucide='BarChart3Icon'
        aria-hidden='true'
        className='size-4'
      />
    )
  },
  {
    id: 'feat-logging',
    title: 'Error Logging',
    description: 'Collect broken links and failed embeds',
    checked: true,
    icon: (
      <RegistryIcon lucide='BugIcon' aria-hidden='true' className='size-4' />
    )
  },
  {
    id: 'feat-cdn',
    title: 'CDN Caching',
    description: 'Resize and cache images near readers',
    checked: false,
    icon: (
      <RegistryIcon lucide='GlobeIcon' aria-hidden='true' className='size-4' />
    )
  },
  {
    id: 'feat-backup',
    title: 'Auto Backup',
    description: 'Keep a nightly copy of every post',
    checked: false,
    icon: (
      <RegistryIcon
        lucide='DatabaseIcon'
        aria-hidden='true'
        className='size-4'
      />
    )
  }
];
export function Pattern() {
  const id = useId();
  return (
    <FieldGroup className='grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2'>
      {features.map((feature) => (
        <FieldLabel key={feature.id} htmlFor={`${id}-${feature.id}`} className='p-0!'>
          <Field orientation='horizontal'>
            <FieldContent>
              <FieldTitle className='flex items-start gap-2'>
                <div className='bg-surface border-border flex shrink-0 items-center justify-center rounded-md border p-1.5 shadow-xs shadow-black/5'>
                  {feature.icon}
                </div>
                <div className='flex flex-col items-start gap-0.5'>
                  <span className='text-sm font-semibold'>{feature.title}</span>
                  <span className='text-text-muted text-xs'>
                    {feature.description}
                  </span>
                </div>
              </FieldTitle>
            </FieldContent>
            <Switch
              id={`${id}-${feature.id}`}
              defaultChecked={feature.checked}
              size='sm'
            />
          </Field>
        </FieldLabel>
      ))}
    </FieldGroup>
  );
}
