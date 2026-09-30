import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
// Tiles take their tone from text and background tokens, so each tone switches with the theme.
const tint = 'border-current/20 bg-current/10';
const tones = [
  { label: 'Soft', variant: 'soft', icon: 'StarIcon', classes: ['', 'text-info', 'text-success', 'text-warning', 'text-danger'] },
  {
    label: 'Solid',
    variant: 'solid',
    icon: 'CircleCheckIcon',
    classes: ['', 'bg-info text-info-foreground', 'bg-success text-success-foreground', 'bg-warning text-warning-foreground', 'bg-danger text-danger-foreground']
  },
  {
    label: 'Tinted',
    variant: 'outline',
    icon: 'ClockIcon',
    classes: [`${tint} text-accent`, `${tint} text-info`, `${tint} text-success`, `${tint} text-warning`, `${tint} text-danger`]
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
