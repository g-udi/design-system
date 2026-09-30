// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { IconStack } from '../../../../src/components/core/Icon/parts/icon-stack-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const stacks = [
  {
    label: 'Neutral',
    className: 'text-ui-foreground',
    iconClassName: 'text-ui-muted-foreground'
  },
  {
    label: 'Primary',
    className: 'text-ui-primary',
    iconClassName: 'text-ui-primary'
  },
  {
    label: 'Success',
    className: 'text-success',
    iconClassName: 'text-success'
  },
  {
    label: 'Warning',
    className: 'text-warning',
    iconClassName: 'text-warning'
  }
];
export function Pattern() {
  return (
    <div className='flex flex-wrap items-end justify-center gap-7'>
      {stacks.map((item) => (
        <div key={item.label} className='flex flex-col items-center gap-2'>
          <IconStack aria-hidden='true' className={item.className}>
            <RegistryIcon
              lucide='SparklesIcon'
              className={`size-4 ${item.iconClassName}`}
            />
          </IconStack>
          <span className='text-ui-muted-foreground text-sm'>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
