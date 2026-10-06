import { IconStack } from '@gaudi/design-system/core/Icon';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const sizes = [
  { label: 'Small', className: 'h-16 w-14', icon: 'ArchiveIcon', iconSize: 'size-3.5' },
  { label: 'Default', className: '', icon: 'LayersIcon', iconSize: 'size-4' },
  { label: 'Large', className: 'h-28 w-24', icon: 'PackageIcon', iconSize: 'size-6' }
];
const colors = [
  { label: 'Neutral', className: 'text-ui-foreground', iconClassName: 'text-text-muted' },
  { label: 'Primary', className: 'text-ui-primary', iconClassName: 'text-ui-primary' },
  { label: 'Success', className: 'text-success', iconClassName: 'text-success' },
  { label: 'Warning', className: 'text-warning', iconClassName: 'text-warning' }
];
function Labelled({ label, children }) {
  return (
    <div className='flex flex-col items-center gap-2'>
      {children}
      <span className='text-text-muted text-xs'>{label}</span>
    </div>
  );
}
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col items-center gap-6'>
      <div className='flex flex-wrap items-end justify-center gap-6'>
        {sizes.map((item) => (
          <Labelled key={item.label} label={item.label}>
            <IconStack aria-hidden='true' className={item.className}>
              <RegistryIcon lucide={item.icon} className={item.iconSize} />
            </IconStack>
          </Labelled>
        ))}
        <Labelled label='Badge'>
          <IconStack aria-hidden='true' className='text-ui-primary'>
            <span className='bg-ui-background text-ui-primary flex size-7 items-center justify-center rounded-full border shadow-xs'>
              <RegistryIcon lucide='CheckIcon' className='size-3.5' />
            </span>
          </IconStack>
        </Labelled>
      </div>
      <div className='flex flex-wrap items-end justify-center gap-6'>
        {colors.map((item) => (
          <Labelled key={item.label} label={item.label}>
            <IconStack aria-hidden='true' className={`h-16 w-14 ${item.className}`}>
              <RegistryIcon lucide='SparklesIcon' className={`size-3.5 ${item.iconClassName}`} />
            </IconStack>
          </Labelled>
        ))}
      </div>
    </div>
  );
}
