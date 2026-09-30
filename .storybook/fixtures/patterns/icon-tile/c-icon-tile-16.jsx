import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const tones = [
  '',
  'bg-info text-white',
  'bg-success text-white',
  'bg-warning text-white',
  'bg-ui-destructive text-white'
];
export function Pattern() {
  return (
    <div className='flex items-center justify-center gap-4'>
      {tones.map((tone) => (
        <IconTile
          key={tone || 'primary'}
          variant='solid'
          className={tone}
          aria-hidden='true'
        >
          <RegistryIcon lucide='CircleCheckIcon' />
        </IconTile>
      ))}
    </div>
  );
}
