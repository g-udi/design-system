import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center gap-4'>
      <IconTile variant='outline' size='lg' radius='full' aria-hidden='true'>
        <RegistryIcon lucide='GlobeIcon' />
      </IconTile>
      <IconTile variant='elevated' size='lg' radius='full' aria-hidden='true'>
        <RegistryIcon lucide='StarIcon' />
      </IconTile>
      <IconTile variant='frame' size='lg' radius='full' aria-hidden='true'>
        <RegistryIcon lucide='CircleCheckIcon' />
      </IconTile>
    </div>
  );
}
