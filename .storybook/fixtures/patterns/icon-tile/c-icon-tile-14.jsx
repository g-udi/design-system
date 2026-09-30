import { IconTile } from '../../../../src/components/core/Icon/parts/icon-tile-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <span className='relative inline-flex' aria-hidden='true'>
        <IconTile variant='elevated'>
          <RegistryIcon lucide='GlobeIcon' />
        </IconTile>
        <span className='border-ui-background bg-success absolute -end-0.5 -top-0.5 size-3 rounded-full border-2' />
      </span>
    </div>
  );
}
