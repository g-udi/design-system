import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const tones = [
  '',
  'text-info-foreground dark:text-info',
  'text-success-foreground dark:text-success',
  'text-warning-foreground dark:text-warning',
  'text-ui-destructive-foreground dark:text-ui-destructive'
];
export function Pattern() {
  return (
    <div className='flex items-center justify-center gap-4'>
      {tones.map((tone) => (
        <IconTile
          key={tone || 'primary'}
          variant='soft'
          className={tone}
          aria-hidden='true'
        >
          <RegistryIcon lucide='StarIcon' />
        </IconTile>
      ))}
    </div>
  );
}
