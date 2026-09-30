import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const tones = [
  {
    label: 'Soft',
    variant: 'soft',
    icon: 'StarIcon',
    classes: [
      '',
      'text-info-foreground dark:text-info',
      'text-success-foreground dark:text-success',
      'text-warning-foreground dark:text-warning',
      'text-ui-destructive-foreground dark:text-ui-destructive'
    ]
  },
  {
    label: 'Solid',
    variant: 'solid',
    icon: 'CircleCheckIcon',
    classes: [
      '',
      'bg-info text-white',
      'bg-success text-white',
      'bg-warning text-white',
      'bg-ui-destructive text-white'
    ]
  },
  {
    label: 'Tinted',
    variant: 'outline',
    icon: 'ClockIcon',
    classes: [
      'border-ui-primary/10 bg-ui-primary/10 text-ui-primary dark:border-ui-primary/25 dark:bg-ui-primary/15',
      'border-info/15 bg-info/10 text-info-foreground dark:border-info/25 dark:bg-info/15 dark:text-info',
      'border-success/15 bg-success/10 text-success-foreground dark:border-success/25 dark:bg-success/15 dark:text-success',
      'border-warning/15 bg-warning/10 text-warning-foreground dark:border-warning/25 dark:bg-warning/15 dark:text-warning',
      'border-ui-destructive/15 bg-ui-destructive/10 text-ui-destructive-foreground dark:border-ui-destructive/25 dark:bg-ui-destructive/15 dark:text-ui-destructive'
    ]
  },
  {
    label: 'Custom fill',
    variant: 'elevated',
    icon: 'MessageSquareIcon',
    classes: [
      'bg-indigo-500 text-white',
      'bg-sky-500 text-white',
      'bg-emerald-600 text-white',
      'bg-amber-500 text-white',
      'bg-rose-500 text-white'
    ]
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-3'>
      {tones.map((tone) => (
        <div key={tone.label} className='grid grid-cols-[4.5rem_1fr] items-center gap-3'>
          <span className='text-text-muted text-xs'>{tone.label}</span>
          <div className='flex flex-wrap items-center gap-2'>
            {tone.classes.map((className) => (
              <IconTile
                key={className || 'primary'}
                variant={tone.variant}
                className={className}
                aria-hidden='true'
              >
                <RegistryIcon lucide={tone.icon} />
              </IconTile>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
