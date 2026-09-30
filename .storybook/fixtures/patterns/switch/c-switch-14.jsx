import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const features = [
  {
    id: 'feat-analytics',
    title: 'Analytics',
    description: 'Track page views and user interactions',
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
    description: 'Capture and report runtime errors',
    checked: true,
    icon: (
      <RegistryIcon lucide='BugIcon' aria-hidden='true' className='size-4' />
    )
  },
  {
    id: 'feat-cdn',
    title: 'CDN Caching',
    description: 'Serve static assets from edge network',
    checked: false,
    icon: (
      <RegistryIcon lucide='GlobeIcon' aria-hidden='true' className='size-4' />
    )
  },
  {
    id: 'feat-backup',
    title: 'Auto Backup',
    description: 'Daily snapshots of your database',
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
  return (
    <FieldGroup className='grid w-full max-w-md grid-cols-2 gap-4'>
      {features.map((feature) => (
        <FieldLabel key={feature.id} htmlFor={feature.id} className='p-0!'>
          <Field orientation='horizontal'>
            <FieldContent>
              <FieldTitle className='flex items-start gap-2'>
                <div className='bg-ui-background border-ui-border flex shrink-0 items-center justify-center rounded-md border p-1.5 shadow-xs shadow-black/5'>
                  {feature.icon}
                </div>
                <div className='flex flex-col items-start gap-0.5'>
                  <span className='text-sm font-semibold'>{feature.title}</span>
                  <span className='text-ui-muted-foreground text-xs'>
                    {feature.description}
                  </span>
                </div>
              </FieldTitle>
            </FieldContent>
            <Switch
              id={feature.id}
              defaultChecked={feature.checked}
              size='sm'
            />
          </Field>
        </FieldLabel>
      ))}
    </FieldGroup>
  );
}
