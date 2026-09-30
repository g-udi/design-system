import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center gap-4'>
      <IconTile variant='elevated' className='size-14' aria-hidden='true'>
        <RegistryIcon lucide='ImageIcon' className='size-7' />
      </IconTile>
      <IconTile
        variant='elevated'
        className='[--icon-tile-icon-size:--spacing(7)] [--icon-tile-size:--spacing(14)]'
        aria-hidden='true'
      >
        <RegistryIcon lucide='Settings2Icon' />
      </IconTile>
    </div>
  );
}
